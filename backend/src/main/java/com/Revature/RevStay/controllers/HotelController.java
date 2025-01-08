package com.Revature.RevStay.controllers;

import com.Revature.RevStay.models.Room;
import com.Revature.RevStay.services.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/hotels")
public class HotelController {

    @Autowired
    private HotelService hotelService;

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