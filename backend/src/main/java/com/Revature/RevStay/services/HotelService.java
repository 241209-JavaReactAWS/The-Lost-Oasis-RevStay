package com.Revature.RevStay.services;

import com.Revature.RevStay.daos.HotelRepository;
import com.Revature.RevStay.daos.UserRepository;
import com.Revature.RevStay.models.Hotel;
import com.Revature.RevStay.models.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class HotelService {

    private final HotelRepository hotelRepository;
    private final UserRepository userRepository;

    public HotelService(HotelRepository hotelRepository, UserRepository userRepository) {
        this.hotelRepository = hotelRepository;
        this.userRepository = userRepository;
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
}
