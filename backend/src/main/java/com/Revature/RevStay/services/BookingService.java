package com.Revature.RevStay.services;

import com.Revature.RevStay.daos.BookingRepository;
import com.Revature.RevStay.daos.HotelRepository;
import com.Revature.RevStay.daos.RoomRepository;
import com.Revature.RevStay.daos.UserRepository;
import com.Revature.RevStay.models.*;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.ResponseTransformer;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import static java.time.temporal.ChronoUnit.DAYS;

@Service
public class BookingService {
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final S3Client S3Client;
    private final EmailService emailService;
    private final NotificationService notificationService;

    @Value("${aws.bucket.name}")
    private String bucketName;

    @Value("${aws.bucket.url}")
    private String bucketURL;

    @Autowired
    public BookingService(UserRepository userRepository, HotelRepository hotelRepository,
                          RoomRepository roomRepository, BookingRepository bookingRepository,
                          S3Client S3Client, EmailService emailService, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.S3Client = S3Client;
        this.emailService = emailService;
        this.notificationService = notificationService;
    }

    public Booking createBooking(String userEmail, BookingRequest bookingRequest) {
        // Validate user
        User customer = userRepository.findByEmail(userEmail);
        if (customer == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");

        // Validate hotel
        Hotel hotel = hotelRepository.findById(bookingRequest.getHotelID())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hotel not found"));

        // Validate room
        Room room = roomRepository.findById(bookingRequest.getRoomID())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));

        // Validate dates
        if (bookingRequest.getCheckInDate().isAfter(bookingRequest.getCheckOutDate()) ||
                bookingRequest.getCheckInDate().isEqual(bookingRequest.getCheckOutDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid check-in and check-out dates");
        }

        // Validate guest count
        if (bookingRequest.getNumGuests() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid number of guests");
        }

        // Create booking
        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setHotel(hotel);
        booking.setRoom(room);
        booking.setCheckIn(bookingRequest.getCheckInDate());
        booking.setCheckOut(bookingRequest.getCheckOutDate());
        booking.setNumGuests(bookingRequest.getNumGuests());
        booking.setTotalPrice(DAYS.between(bookingRequest.getCheckInDate(), bookingRequest.getCheckOutDate()) * room.getPricePerNight());
        booking.setStatus(BookingStatus.PENDING);

        // Save booking
        Booking savedBooking = bookingRepository.save(booking);

        // Send email notification
        sendBookingConfirmationEmail(customer, savedBooking);

        // Send notification to hotel
        this.notificationService.sendNotification(hotel.getOwner(), "New Booking Request",
                "A new booking request has been made for your hotel for dates %s through %s.".formatted(
                        savedBooking.getCheckIn().format(DateTimeFormatter.ofPattern("MM/dd/yyyy")),
                        savedBooking.getCheckOut().format(DateTimeFormatter.ofPattern("MM/dd/yyyy"))));

        return savedBooking;
    }

    public List<Booking> getCustomerBookings(String customerEmail) {
        User customer = this.userRepository.findByEmail(customerEmail);
        if (customer == null) return List.of();
        else return this.bookingRepository.findAllByCustomer(customer);
    }

    public void cancelBooking(Integer id) {
        Booking booking = this.bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
        booking.setStatus(BookingStatus.USER_CANCELED);
        //send cancellation email
        sendCanceledEmail(booking.getCustomer(), booking);
        this.bookingRepository.save(booking);
    }

    public Booking updateBooking(Integer bookingId, BookingRequest updatedRequest) {
        // Find booking
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        // Update booking details
        booking.setCheckIn(updatedRequest.getCheckInDate());
        booking.setCheckOut(updatedRequest.getCheckOutDate());
        booking.setNumGuests(updatedRequest.getNumGuests());
        booking.setTotalPrice(DAYS.between(updatedRequest.getCheckInDate(), updatedRequest.getCheckOutDate()) * booking.getRoom().getPricePerNight());
        booking.setStatus(BookingStatus.CONFIRMED);

        // Save updated booking
        Booking updatedBooking = bookingRepository.save(booking);

        // Send email notification
        sendBookingUpdateEmail(booking.getCustomer(), updatedBooking);

        // Send notification to hotel
        this.notificationService.sendNotification(updatedBooking.getHotel().getOwner(), "Booking Update",
                "A booking for your hotel has been updated for dates %s through %s.".formatted(
                        updatedBooking.getCheckIn().format(DateTimeFormatter.ofPattern("MM/dd/yyyy")),
                        updatedBooking.getCheckOut().format(DateTimeFormatter.ofPattern("MM/dd/yyyy"))));

        return updatedBooking;
    }

    public List<Booking> getAllHotelBookings(int hotelId) {
        return this.bookingRepository.findAllByHotelId(hotelId);
    }

    public void generateInvoice(Integer bookingId, OutputStream outputStream) {
        Optional<Booking> bookingOpt = this.bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        Booking booking = bookingOpt.get();

        try (PDDocument invoiceDocument = new PDDocument()) {

            PDDocumentInformation invoiceInfo = invoiceDocument.getDocumentInformation();
            invoiceInfo.setAuthor("RevStay");
            invoiceInfo.setTitle("RevStay - Booking Confirmation #%s - %s".formatted(booking.getId(), booking.getHotel().getName()));

            final PDType0Font MW_REGULAR = PDType0Font.load(invoiceDocument, ClassLoader.getSystemResourceAsStream("fonts/Merriweather-Regular.ttf"));
            final PDType0Font MW_BOLD = PDType0Font.load(invoiceDocument, ClassLoader.getSystemResourceAsStream("fonts/Merriweather-Bold.ttf"));
            final PDType0Font MW_LIGHT = PDType0Font.load(invoiceDocument, ClassLoader.getSystemResourceAsStream("fonts/Merriweather-Light.ttf"));

            PDPage invoicePage = new PDPage();
            PDPageContentStream stream = new PDPageContentStream(invoiceDocument, invoicePage, PDPageContentStream.AppendMode.OVERWRITE, true, true);

            stream.beginText();
            stream.setFont(MW_BOLD, 36);
            stream.setLeading(16f);
            stream.newLineAtOffset(50, 700);
            stream.showText("RevStay");
            stream.newLine();
            stream.newLine();
            stream.setFont(MW_LIGHT, 14);
            stream.showText("Booking Confirmation #%d".formatted(booking.getId()));
            stream.newLine();
            stream.endText();

            File image = File.createTempFile("imageFile", null);;
            List<String> hotelImages = booking.getHotel().getImages();
            if (!hotelImages.isEmpty()) {
                GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                        .bucket(bucketName)
                        .key(hotelImages.get(0).replace("%s/".formatted(bucketURL), ""))
                        .build();
                ResponseBytes<GetObjectResponse> getObjectResponse = this.S3Client.getObject(getObjectRequest, ResponseTransformer.toBytes());
                byte[] data = getObjectResponse.asByteArray();
                Files.write(image.toPath(), data);
            } else {
                InputStream is = ClassLoader.getSystemResourceAsStream("images/hotel-placeholder.png");
                if (is != null) Files.copy(is, image.toPath(), StandardCopyOption.REPLACE_EXISTING);
                else throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred.");
            }

            PDImageXObject hotelImage = PDImageXObject.createFromFileByContent(image, invoiceDocument);

            stream.drawImage(hotelImage, 32, 375, 512, 256);

            stream.moveTo(0, 0);
            stream.beginText();
            stream.setFont(MW_REGULAR, 16);
            stream.newLineAtOffset(32, 350);
            stream.showText(booking.getHotel().getName());
            stream.newLine();
            stream.setFont(MW_LIGHT, 14);
            stream.showText(booking.getHotel().getAddress());
            stream.newLine();
            stream.showText("%s, %s".formatted(booking.getHotel().getCity(), booking.getHotel().getState()));
            stream.newLine();
            stream.newLine();
            stream.setFont(MW_BOLD, 16);
            stream.showText("Customer: ");
            stream.setFont(MW_REGULAR, 16);
            stream.showText("%s %s".formatted(booking.getCustomer().getFirstName(), booking.getCustomer().getLastName()));
            stream.newLine();
            stream.newLine();
            stream.setFont(MW_BOLD, 16);
            stream.showText("Room: ");
            stream.setFont(MW_REGULAR, 16);
            stream.showText(String.valueOf(booking.getRoom().getRoomType()));
            stream.newLine();
            stream.newLine();
            stream.setFont(MW_BOLD, 16);
            stream.showText("Check-in: ");
            stream.setFont(MW_REGULAR, 16);
            stream.showText(booking.getCheckIn().format(DateTimeFormatter.ofPattern("MM/dd/yyyy")));
            stream.newLine();
            stream.newLine();
            stream.setFont(MW_BOLD, 16);
            stream.showText("Check-out: ");
            stream.setFont(MW_REGULAR, 16);
            stream.showText(booking.getCheckOut().format(DateTimeFormatter.ofPattern("MM/dd/yyyy")));
            stream.newLine();
            stream.newLine();
            stream.setFont(MW_BOLD, 16);
            stream.showText("TOTAL: ");
            stream.setFont(MW_REGULAR, 16);
            stream.showText("$%.2f".formatted(booking.getTotalPrice()));
            stream.newLine();
            stream.newLine();
            stream.newLine();
            stream.newLine();
            stream.setFont(MW_LIGHT, 16);
            stream.showText("Thanks for booking your stay with us!");
            stream.endText();

            stream.close();

            invoiceDocument.addPage(invoicePage);
            invoiceDocument.save(outputStream);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An IO Exception occurred while generating the invoice document.");
        }
    }

    private void sendBookingConfirmationEmail(User customer, Booking booking) {
        String subject = "Booking Confirmation - RevStay";
        String message = String.format("Dear %s %s,\n\nYour booking is confirmed!\n\nDetails:\nHotel: %s\nRoom: %s\nCheck-in: %s\nCheck-out: %s\nTotal Price: $%.2f\n\nThank you for choosing RevStay!",
                customer.getFirstName(),
                customer.getLastName(),
                booking.getHotel().getName(),
                booking.getRoom().getRoomType(),
                booking.getCheckIn().format(DateTimeFormatter.ofPattern("MM/dd/yyyy")),
                booking.getCheckOut().format(DateTimeFormatter.ofPattern("MM/dd/yyyy")),
                booking.getTotalPrice());

        emailService.sendEmail(customer.getEmail(), subject, message);
    }

    private void sendBookingUpdateEmail(User customer, Booking booking) {
        String subject = "Booking Updated - RevStay";
        String message = String.format("Dear %s %s,\n\nYour booking has been updated!\n\nUpdated Details:\nHotel: %s\nRoom: %s\nCheck-in: %s\nCheck-out: %s\nTotal Price: $%.2f\n\nThank you for choosing RevStay!",
                customer.getFirstName(),
                customer.getLastName(),
                booking.getHotel().getName(),
                booking.getRoom().getRoomType(),
                booking.getCheckIn().format(DateTimeFormatter.ofPattern("MM/dd/yyyy")),
                booking.getCheckOut().format(DateTimeFormatter.ofPattern("MM/dd/yyyy")),
                booking.getTotalPrice());

        emailService.sendEmail(customer.getEmail(), subject, message);
    }
    private void sendCanceledEmail(User customer, Booking booking) {
        String subject = "Booking Updated - RevStay";
        String message = String.format("Dear %s %s,\n\nYour booking has been canceled!\n\nUpdated Details:\nHotel: %s\nRoom: %s\nCheck-in: %s\nCheck-out: %s\nTotal Price: $%.2f\n\nThank you for choosing RevStay!",
                customer.getFirstName(),
                customer.getLastName(),
                booking.getHotel().getName(),
                booking.getRoom().getRoomType(),
                booking.getCheckIn().format(DateTimeFormatter.ofPattern("MM/dd/yyyy")),
                booking.getCheckOut().format(DateTimeFormatter.ofPattern("MM/dd/yyyy")),
                booking.getTotalPrice());

        emailService.sendEmail(customer.getEmail(), subject, message);
    }
}
