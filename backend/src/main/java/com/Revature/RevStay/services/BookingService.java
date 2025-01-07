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

    @Autowired
    public BookingService(UserRepository userRepository, HotelRepository hotelRepository, RoomRepository roomRepository, BookingRepository bookingRepository, S3Client S3Client) {
        this.userRepository = userRepository;
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.S3Client = S3Client;
    }

    public Booking book(Integer userID, BookingRequest bookingRequest) {
        Booking booking = new Booking();

        Optional<User> user = this.userRepository.findById(userID);
        if (user.isEmpty())
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred.");
        booking.setCustomer(user.get());

        Optional<Hotel> hotel = this.hotelRepository.findById(bookingRequest.getHotelID());
        if (hotel.isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unable to find hotel with given ID");
        booking.setHotel(hotel.get());

        Optional<Room> room = this.roomRepository.findById(bookingRequest.getRoomID());
        if (room.isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unable to find room with given ID");
        booking.setRoom(room.get());

        if (bookingRequest.getCheckInDate().isAfter(bookingRequest.getCheckOutDate()) || bookingRequest.getCheckInDate().equals(bookingRequest.getCheckOutDate()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid check-in and check-out dates.");
        booking.setCheckIn(bookingRequest.getCheckInDate());
        booking.setCheckOut(bookingRequest.getCheckOutDate());

        if (bookingRequest.getNumGuests() <= 0)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid number of guests");
        booking.setNumGuests(bookingRequest.getNumGuests());

        booking.setTotalPrice(DAYS.between(booking.getCheckIn(), booking.getCheckOut()) * booking.getRoom().getPricePerNight());
        booking.setStatus(BookingStatus.PENDING);

        return this.bookingRepository.save(booking);
    }

    public List<Booking> getCustomerBookings(String customerEmail) {
        User customer = this.userRepository.findByEmail(customerEmail);
        if (customer == null) return List.of();
        else return this.bookingRepository.findAllByCustomer(customer);
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
                        .key(hotelImages.get(0))
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
            stream.showText(booking.getRoom().getRoomType());
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
}
