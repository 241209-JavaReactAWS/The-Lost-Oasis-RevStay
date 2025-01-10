package com.Revature.RevStay.controllers;
import com.Revature.RevStay.dtos.RoomRequest;
import com.Revature.RevStay.models.Hotel;
import com.Revature.RevStay.models.Room;
import com.Revature.RevStay.services.RoomService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
            @RequestPart("images") List<MultipartFile> images
    ) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        RoomRequest roomRequest = mapper.readValue(roomData, RoomRequest.class);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Room room = roomService.addRoom(hotelId, roomRequest, images, email);
        return ResponseEntity.ok(room);
    }

    @GetMapping
    public ResponseEntity<List<Room>> getRoomsByHotelId(@PathVariable Integer hotelId) {
        List<Room> rooms = roomService.getRoomsByHotelId(hotelId);
        return ResponseEntity.ok(rooms);
    }
}
