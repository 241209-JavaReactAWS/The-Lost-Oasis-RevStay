package com.Revature.RevStay.controllers;

import com.Revature.RevStay.dtos.BulkRoomCreationDTO;
import com.Revature.RevStay.models.Hotel;
import com.Revature.RevStay.models.Room;
import com.Revature.RevStay.services.HotelService;
import com.Revature.RevStay.services.RoomService;
import com.Revature.RevStay.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hotels")
public class HotelController {

    private final HotelService hotelService;
    private final UserService userService;
    private final RoomService roomService;

    public HotelController(HotelService hotelService, UserService userService, RoomService roomService) {
        this.hotelService = hotelService;
        this.userService = userService;
        this.roomService = roomService;
    }

    @PostMapping
    public ResponseEntity<Hotel> createHotel(@RequestBody Hotel hotel) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Long userId = userService.getUserIdByEmail(email);

        Hotel createdHotel = hotelService.createHotel(hotel, userId);
        return ResponseEntity.ok(createdHotel);
    }

    @PostMapping("/{hotelId}/rooms/bulk")
    public ResponseEntity<List<Room>> addRoomsInBulk(@PathVariable Integer hotelId, @RequestBody List<BulkRoomCreationDTO> bulkRoomCreationDTOs) {
        return hotelService.getHotelById(hotelId)
                .map(hotel -> {
                    List<Room> createdRooms = roomService.createRoomsInBulk(hotel, bulkRoomCreationDTOs);
                    return new ResponseEntity<>(createdRooms, HttpStatus.CREATED);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
  
  
  // Add a new room to a hotel
    @PostMapping("/{hotelId}/rooms")
    public ResponseEntity<Room> addRoom(@PathVariable Integer hotelId, @RequestBody Room room) {
        Room addedRoom = hotelService.addRoomToHotel(hotelId, room);

        if (addedRoom == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(addedRoom);
    }

    // Update room availability or status
    @PutMapping("/rooms/{roomId}")
    public ResponseEntity<Room> updateRoom(@PathVariable Integer roomId, @RequestBody Room updatedRoom) {
        Room room = hotelService.updateRoomDetails(roomId, updatedRoom);

        if (room == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(room);
    }
  
  
  
  
}

