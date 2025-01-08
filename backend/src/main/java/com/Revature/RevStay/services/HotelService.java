package com.Revature.RevStay.services;

import com.Revature.RevStay.daos.HotelRepository;
import com.Revature.RevStay.daos.RoomRepository;
import com.Revature.RevStay.models.Hotel;
import com.Revature.RevStay.models.Room;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    public Room addRoomToHotel(Integer hotelId, Room room) {
        Optional<Hotel> hotelOptional = hotelRepository.findById(hotelId);

        if (hotelOptional.isPresent()) {
            Hotel hotel = hotelOptional.get();
            room.setHotel(hotel);
            return roomRepository.save(room);
        }


        return null;
    }

    public Room updateRoomDetails(Integer roomId, Room updatedRoom) {
        Optional<Room> roomOptional = roomRepository.findById(roomId);

        if (roomOptional.isPresent()) {
            Room existingRoom = roomOptional.get();
            existingRoom.setPricePerNight(updatedRoom.getPricePerNight());
            existingRoom.setIsAvailable(updatedRoom.getIsAvailable());
            existingRoom.setStatus(updatedRoom.getStatus());
            return roomRepository.save(existingRoom);
        }

        // Return null or handle the case where the room is not found
        return null;
    }
    }

