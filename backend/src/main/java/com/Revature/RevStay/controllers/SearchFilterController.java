package com.Revature.RevStay.controllers;

import com.Revature.RevStay.models.Hotel;
import com.Revature.RevStay.services.SearchFilterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/filter")
public class SearchFilterController {

    private final SearchFilterService searchFilterService;

    @Autowired
    public SearchFilterController(SearchFilterService searchFilterService) {
        this.searchFilterService = searchFilterService;
    }

    /**
     * Filters hotels based on multiple search criteria.
     * @param city       City name (optional).
     * @param state      State name (optional).
     * @param minPrice   Minimum price for rooms (optional).
     * @param maxPrice   Maximum price for rooms (optional).
     * @param amenities  Desired amenities (optional).
     * @param minRating  Minimum rating for hotels (optional).
     * @return A list of hotels matching the criteria.
     */
    @GetMapping("/filter")
    public ResponseEntity<List<Hotel>> filterHotels(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String amenities,
            @RequestParam(required = false) Integer minRating) {

        List<Hotel> filteredHotels = searchFilterService.searchHotels(city, state, minPrice, maxPrice, amenities, minRating);
        return ResponseEntity.ok(filteredHotels);
    }

    /**
     * Retrieves all hotels.
     * @return A list of all available hotels.
     */
    @GetMapping("/all")
    public ResponseEntity<List<Hotel>> getAllHotels() {
        List<Hotel> hotels = searchFilterService.getAllHotels();
        return ResponseEntity.ok(hotels);
    }

    /**
     * Filters hotels by price range.
     * @param minPrice Minimum room price.
     * @param maxPrice Maximum room price.
     * @return A list of hotels within the specified price range.
     */
    @GetMapping("/price-range")
    public ResponseEntity<List<Hotel>> filterHotelsByPriceRange(
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice) {

        List<Hotel> hotels = searchFilterService.findHotelsByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(hotels);
    }
}