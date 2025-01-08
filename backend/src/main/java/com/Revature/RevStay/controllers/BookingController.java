package com.Revature.RevStay.controllers;

import com.Revature.RevStay.models.Booking;
import com.Revature.RevStay.models.BookingRequest;
import com.Revature.RevStay.services.BookingService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {
    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequest bookingRequest, @RequestAttribute UserDetails userDetails) {
        return ResponseEntity.ok(this.bookingService.createBooking(userDetails.getUsername(), bookingRequest));
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookingsForCustomer(@RequestAttribute UserDetails userDetails) {
        return ResponseEntity.ok(this.bookingService.getCustomerBookings(userDetails.getUsername()));
    }
    
    @GetMapping("/hotel/{id}")
    public ResponseEntity<List<Booking>> getAllBookingsForHotel(@PathVariable Integer id) {
        return ResponseEntity.ok(this.bookingService.getAllHotelBookings(id));
    }

    @GetMapping("/invoice/{id}")
    public void getInvoice(HttpServletResponse response, @PathVariable Integer id) {
        response.setHeader("Content-Type", "application/pdf");
        try {
            this.bookingService.generateInvoice(id, response.getOutputStream());
            response.flushBuffer();
            response.setStatus(HttpStatus.OK.value());
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
