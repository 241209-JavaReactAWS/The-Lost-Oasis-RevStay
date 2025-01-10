package com.Revature.RevStay.controllers;
import com.Revature.RevStay.models.Hotel;
import com.Revature.RevStay.models.Room;
import com.Revature.RevStay.services.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hotels/{hotelId}/rooms")
@CrossOrigin(origins = "http://localhost:5173")
public class RoomController {
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    public ResponseEntity<List<Room>> getRoomsByHotelId(@PathVariable Integer hotelId) {
        List<Room> rooms = roomService.getRoomsByHotelId(hotelId);
        return new ResponseEntity<>(rooms, HttpStatus.OK);
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<Room> getRoomByIdAndHotelId(@PathVariable Integer hotelId, @PathVariable Integer roomId) {
        return roomService.getRoomByIdAndHotelId(roomId, hotelId)
                .map(room -> new ResponseEntity<>(room, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Room> createRoom(@PathVariable Integer hotelId, @RequestBody Room room) {
        room.setHotel(new Hotel(hotelId));
        Room savedRoom = roomService.saveRoom(room);
        return new ResponseEntity<>(savedRoom, HttpStatus.CREATED);
    }

    @PutMapping("/{roomId}")
    public ResponseEntity<Room> updateRoom(@PathVariable Integer hotelId, @PathVariable Integer roomId, @RequestBody Room room) {
        return roomService.getRoomByIdAndHotelId(roomId, hotelId)
                .map(existingRoom -> {
                    room.setId(roomId);
                    room.setHotel(new Hotel(hotelId));
                    return new ResponseEntity<>(roomService.saveRoom(room), HttpStatus.OK);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Integer hotelId, @PathVariable Integer roomId) {
        return roomService.getRoomByIdAndHotelId(roomId, hotelId)
                .map(room -> {
                    roomService.deleteRoom(roomId);
                    return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
