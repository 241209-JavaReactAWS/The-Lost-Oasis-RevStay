package com.Revature.RevStay.services;

import com.Revature.RevStay.daos.SearchFilterRepository;
import com.Revature.RevStay.models.Hotel;

import com.Revature.RevStay.specifications.HotelFilterSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;


import java.util.List;



@Service
public class SearchFilterService {

    private final SearchFilterRepository searchFilterRepository;

    @Autowired
    public SearchFilterService(SearchFilterRepository searchFilterRepository) {
        this.searchFilterRepository = searchFilterRepository;
    }

    public List<Hotel> searchHotels(String city, String state, Double minPrice, Double maxPrice, String amenities, Integer minRating) {
        Specification<Hotel> spec = Specification
                .where(HotelFilterSpecification.hasCity(city))
                .and(HotelFilterSpecification.hasState(state))
                .and(HotelFilterSpecification.hasMinPrice(minPrice))
                .and(HotelFilterSpecification.hasMaxPrice(maxPrice))
                .and(HotelFilterSpecification.hasAmenities(amenities));

        List<Hotel> results = searchFilterRepository.findAll(spec);
        if (minRating != null) {
            results.removeIf(hotel -> hotel.getRating() < minRating);
        }
        return results;
    }

    public List<Hotel> findHotelsByPriceRange(Double minPrice, Double maxPrice) {
        return searchFilterRepository.findByPriceRange(minPrice, maxPrice);
    }


    public List<Hotel> getAllHotels() {
        return searchFilterRepository.findAll();
    }
}