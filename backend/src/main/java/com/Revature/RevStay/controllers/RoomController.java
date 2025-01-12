package com.Revature.RevStay.controllers;
import com.Revature.RevStay.dtos.RoomRequest;
import com.Revature.RevStay.models.Room;
import com.Revature.RevStay.services.RoomService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/hotels/{hotelId}/rooms")
@CrossOrigin(origins = "http://localhost:5173")
public class RoomController {
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Room> addRoom(
            @PathVariable Integer hotelId,
            @RequestPart("data") String roomData,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) throws JsonProcessingException {
        System.out.println("Received room creation request for hotel: " + hotelId);
        System.out.println("Room data: " + roomData);
        System.out.println("Images null? " + (images == null));
        System.out.println("Number of images received: " + (images != null ? images.size() : 0));

        if (images != null) {
            images.forEach(image -> {
                System.out.println("Image name: " + image.getOriginalFilename());
                System.out.println("Image size: " + image.getSize());
            });
        }

        ObjectMapper mapper = new ObjectMapper();
        RoomRequest roomRequest = mapper.readValue(roomData, RoomRequest.class);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        List<MultipartFile> imagesList = images != null ? images : new ArrayList<>();

        Room room = roomService.addRoom(hotelId, roomRequest, imagesList, email);
        return ResponseEntity.ok(room);
    }

    @GetMapping
    public ResponseEntity<List<Room>> getRoomsByHotelId(@PathVariable Integer hotelId) {
        List<Room> rooms = roomService.getRoomsByHotelId(hotelId);
        return ResponseEntity.ok(rooms);
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<?> deleteRoom(
            @PathVariable Integer roomId
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        roomService.deleteRoom(roomId, email);
        return ResponseEntity.ok().build();
    }

    @PutMapping(value = "/{roomId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Room> updateRoom(
            @PathVariable Integer hotelId,
            @PathVariable Integer roomId,
            @RequestPart("data") String roomData,
            @RequestPart(value = "images", required = false) List<MultipartFile> newImages,
            @RequestPart(value = "deletedImages", required = false) String deletedImagesJson
    ) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        RoomRequest roomRequest = mapper.readValue(roomData, RoomRequest.class);
        List<String> deletedImages = deletedImagesJson != null ?
                mapper.readValue(deletedImagesJson, new TypeReference<List<String>>() {}) :
                new ArrayList<>();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Room updatedRoom = roomService.updateRoom(hotelId, roomId, roomRequest, newImages, deletedImages, email);
        return ResponseEntity.ok(updatedRoom);
    }
}
