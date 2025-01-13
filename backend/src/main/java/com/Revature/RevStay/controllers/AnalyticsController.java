package com.Revature.RevStay.controllers;

import com.Revature.RevStay.services.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    @Autowired
    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getOwnerAnalytics(@PathVariable long userId) {
        try{

            Map<String, Object> analytics = analyticsService.getOwnerAnalytics(userId);
        }catch (Exception e){
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch analytics: " + e.getMessage()));
        }


        return ResponseEntity.ok(analyticsService.getOwnerAnalytics(userId));
    }
}
