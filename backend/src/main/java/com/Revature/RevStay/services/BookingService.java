package com.Revature.RevStay.services;

import com.Revature.RevStay.daos.BookingRepository;
import com.Revature.RevStay.models.Booking;
import com.Revature.RevStay.models.InvoiceDTO;
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

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;

    @Autowired
    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public InvoiceDTO generateInvoice(Integer bookingId) {
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

            // todo get this image from S3
            File image = File.createTempFile("imageFile", null);
            InputStream is = ClassLoader.getSystemResourceAsStream();
            if (is != null) Files.copy(is, image.toPath(), StandardCopyOption.REPLACE_EXISTING);
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
            stream.showText("%s %s".formatted(booking.getUser().getFirstName(), booking.getUser().getLastName()));
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

            // todo upload PDF file to S3 and return link

        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An IO Exception occurred while generating the invoice document.");
        }
    }
}
