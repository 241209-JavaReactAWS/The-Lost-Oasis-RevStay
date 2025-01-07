package com.Revature.RevStay.controllers;

import com.Revature.RevStay.services.ReviewService;
import com.Revature.RevStay.services.ReviewService.ReviewNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import com.Revature.RevStay.models.Review;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;

/*

Mapping Endpoints:

POST /reviews: Create a new review.
GET /reviews/{id}: Get a review by its ID.
GET /reviews/user/{userId}: Get all reviews for a specific user.
GET /reviews/hotel/{hotelId}: Get all reviews for a specific hotel.
GET /reviews: Get all reviews.
DELETE /reviews/{id}: Delete a review by its ID.
 */

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Create a Review
    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review) {
        Review createdReview = reviewService.createReview(review);
        return ResponseEntity.ok(createdReview);
    }

    // Get Review by ID
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable int id) {
        Optional<Review> review = reviewService.getReviewById(id);
        return review.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get all Reviews for a User
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsByUser(@PathVariable int userId) {
        List<Review> reviews = reviewService.getReviewsByUser(userId);
        return ResponseEntity.ok(reviews);
    }

    // Get all Reviews for a Hotel
    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<Review>> getReviewsByHotel(@PathVariable int hotelId) {
        List<Review> reviews = reviewService.getReviewsByHotel(hotelId);
        return ResponseEntity.ok(reviews);
    }

    // Get all Reviews
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }

    // Delete a Review
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable int id) {
        try {
            reviewService.deleteReview(id);
            return ResponseEntity.ok("Review deleted successfully");
        } catch (ReviewNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}


