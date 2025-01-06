package com.Revature.RevStay.controllers;

import com.Revature.RevStay.services.BookingService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

@RestController
@RequestMapping("/booking")
public class BookingController {
    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
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
