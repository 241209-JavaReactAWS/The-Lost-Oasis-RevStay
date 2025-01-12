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

    @GetMapping("/filter")
    public List<Hotel> filterHotels(@RequestParam(required = false) String city,
                                    @RequestParam(required = false) String state,
                                    @RequestParam(required = false) Double minPrice,
                                    @RequestParam(required = false) Double maxPrice,
                                    @RequestParam(required = false) String amenities,
                                    @RequestParam(required = false) Integer minRating) {
        return searchFilterService.searchHotels(city, state, minPrice, maxPrice, amenities, minRating);
    }



    @GetMapping("/all")
    public ResponseEntity<List<Hotel>> getAllHotels() {
        List<Hotel> hotels = searchFilterService.getAllHotels();
        return ResponseEntity.ok(hotels);
    }

    @GetMapping("/price-range")
    public ResponseEntity<List<Hotel>> filterHotelsByPriceRange(
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice) {
        List<Hotel> hotels = searchFilterService.getHotelsByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(hotels);
    }
}