package com.Revature.RevStay.controllers;

import com.Revature.RevStay.models.Hotel;
import com.Revature.RevStay.services.SearchFilterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SearchFilterController {

    private final SearchFilterService searchFilterService;

    @Autowired
    public SearchFilterController(SearchFilterService searchFilterService) {
        this.searchFilterService = searchFilterService;
    }

    @GetMapping("/search")
    public List<Hotel> searchHotels(@RequestParam String keyword) {
        return searchFilterService.searchHotels(keyword);
    }

    @GetMapping("/filter")
    public List<Hotel> filterHotels(@RequestParam(required = false) String city, @RequestParam(required = false) String state) {
        return searchFilterService.filterHotels(city, state);
    }
}