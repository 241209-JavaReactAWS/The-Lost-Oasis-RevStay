package com.Revature.RevStay.controllers;

import com.Revature.RevStay.dtos.HotelRequest;
import com.Revature.RevStay.models.Hotel;
import com.Revature.RevStay.services.HotelService;
import com.Revature.RevStay.services.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/api/v1/hotels")
@CrossOrigin(origins = "http://localhost:5173")
public class HotelController {

    private static final Logger logger = LoggerFactory.getLogger(HotelController.class);

    private final HotelService hotelService;
    private final UserService userService;

    public HotelController(HotelService hotelService, UserService userService) {
        this.hotelService = hotelService;
        this.userService = userService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Hotel> createHotel(
            @RequestPart("data") String hotelData,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) throws JsonProcessingException {
        System.out.println("Received hotel creation request");
        System.out.println("Hotel data: " + hotelData);
        System.out.println("Images null? " + (images == null));
        System.out.println("Number of images received: " + (images != null ? images.size() : 0));

        if (images != null) {
            images.forEach(image -> {
                System.out.println("Image name: " + image.getOriginalFilename());
                System.out.println("Image size: " + image.getSize());
            });
        }

        ObjectMapper mapper = new ObjectMapper();
        HotelRequest hotelRequest = mapper.readValue(hotelData, HotelRequest.class);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Long userId = userService.getUserIdByEmail(email);

        List<MultipartFile> imagesList = images != null ? images : new ArrayList<>();

        Hotel hotel = hotelService.createHotel(hotelRequest, imagesList, userId);
        return ResponseEntity.ok(hotel);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotel(@PathVariable Integer id) {
        Hotel hotel = hotelService.getHotelWithImages(id);
        return ResponseEntity.ok(hotel);
    }

    @GetMapping("/admin")
    public ResponseEntity<List<Hotel>> getUserHotels() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Long userId = userService.getUserIdByEmail(email);

        List<Hotel> hotels = hotelService.getHotelsByUserId(userId);
        return ResponseEntity.ok(hotels);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHotel(@PathVariable Integer id) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Long userId = userService.getUserIdByEmail(email);

        hotelService.deleteHotel(id, userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Hotel> updateHotel(
            @PathVariable Integer id,
            @RequestPart("data") String hotelData,
            @RequestPart(value = "images", required = false) List<MultipartFile> newImages,
            @RequestPart(value = "deletedImages", required = false) String deletedImagesJson
    ) throws JsonProcessingException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Long userId = userService.getUserIdByEmail(email);

        ObjectMapper mapper = new ObjectMapper();
        HotelRequest hotelRequest = mapper.readValue(hotelData, HotelRequest.class);
        List<String> deletedImages = deletedImagesJson != null ?
                mapper.readValue(deletedImagesJson, new TypeReference<List<String>>() {}) :
                new ArrayList<>();

        Hotel updatedHotel = hotelService.updateHotel(id, hotelRequest, newImages, deletedImages, userId);
        return ResponseEntity.ok(updatedHotel);
    }
}

