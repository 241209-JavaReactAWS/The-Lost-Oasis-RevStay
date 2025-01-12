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

    public List<Hotel> searchHotels(String city, String state, Double minPrice, Double maxPrice, String amenities, Integer minRating) {
        return hotelRepository.findAll().stream()
                .filter(hotel -> (city == null || hotel.getCity().equalsIgnoreCase(city)) &&
                        (state == null || hotel.getState().equalsIgnoreCase(state)) &&
                        (minPrice == null || hotel.getRooms().stream().anyMatch(room -> room.getPricePerNight() >= minPrice)) &&
                        (maxPrice == null || hotel.getRooms().stream().anyMatch(room -> room.getPricePerNight() <= maxPrice)) &&
                        (amenities == null || hotel.getAmenities().contains(amenities)) &&
                        (minRating == null || hotel.getRating() >= minRating))
                .collect(Collectors.toList());
    }

    public List<Hotel> getHotelsByPriceRange(Double minPrice, Double maxPrice) {
        return hotelRepository.findByPriceRange(minPrice, maxPrice);
    }

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }



}