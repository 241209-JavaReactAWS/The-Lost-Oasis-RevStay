package com.Revature.RevStay.controllers;
import com.Revature.RevStay.models.Hotel;
import com.Revature.RevStay.services.HotelService;
import com.Revature.RevStay.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/v1/hotels")
public class HotelController {

    private final HotelService hotelService;
    private final UserService userService;

    public HotelController(HotelService hotelService, UserService userService) {
        this.hotelService = hotelService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Hotel> createHotel(@RequestBody Hotel hotel) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Long userId = userService.getUserIdByEmail(email);

        Hotel createdHotel = hotelService.createHotel(hotel, userId);
        return ResponseEntity.ok(createdHotel);
    }
}
