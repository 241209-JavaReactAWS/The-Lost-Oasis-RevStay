package com.Revature.RevStay.services;

import com.Revature.RevStay.models.Hotel;
import com.Revature.RevStay.daos.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchFilterService {

    private final HotelRepository hotelRepository;

    @Autowired
    public SearchFilterService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    public List<Hotel> searchHotels(String keyword) {
        return hotelRepository.findAll().stream()
                .filter(hotel -> hotel.getName().contains(keyword) || hotel.getCity().contains(keyword) || hotel.getState().contains(keyword))
                .collect(Collectors.toList());
    }

    public List<Hotel> filterHotels(String city, String state) {
        return hotelRepository.findAll().stream()
                .filter(hotel -> (city == null || hotel.getCity().equalsIgnoreCase(city)) &&
                        (state == null || hotel.getState().equalsIgnoreCase(state)))
                .collect(Collectors.toList());
    }
}

