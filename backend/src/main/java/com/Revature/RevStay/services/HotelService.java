package com.Revature.RevStay.services;

import com.Revature.RevStay.daos.HotelRepository;
import com.Revature.RevStay.daos.RoomRepository;
import com.Revature.RevStay.models.Room;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.Service;
import com.Revature.RevStay.daos.UserRepository;
import com.Revature.RevStay.models.Hotel;
import com.Revature.RevStay.models.User;
import org.springframework.transaction.annotation.Transactional;


import java.util.Optional;

@Service
public class HotelService {


    private final HotelRepository hotelRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    public HotelService(HotelRepository hotelRepository, UserRepository userRepository,RoomRepository roomRepository) {
        this.hotelRepository = hotelRepository;
        this.userRepository = userRepository;
      this.roomRepository = roomRepository;
    }

    @Transactional
    public Hotel createHotel(Hotel hotel, Long userId) {
        //TODO replace with user.
        userId = 1L;
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        hotel.setOwner(user);
        return hotelRepository.save(hotel);
    }

    public Optional<Hotel> getHotelById(Integer hotelId) {
        return hotelRepository.findById(hotelId);
    }



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

