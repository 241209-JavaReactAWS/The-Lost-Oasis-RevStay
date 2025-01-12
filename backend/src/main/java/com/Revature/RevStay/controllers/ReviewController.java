package com.Revature.RevStay.controllers;

import com.Revature.RevStay.dtos.ReviewRequest;
import com.Revature.RevStay.dtos.ReviewResponseRequest;
import com.Revature.RevStay.services.ReviewService;
import com.Revature.RevStay.services.ReviewService.ReviewNotFoundException;

import com.Revature.RevStay.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import com.Revature.RevStay.models.Review;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.server.ResponseStatusException;

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
    private final ReviewService reviewService;
    private final UserService userService;

    @Autowired
    public ReviewController(ReviewService reviewService, UserService userService) {
        this.reviewService = reviewService;
        this.userService = userService;
    }

    // Create a Review
    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody ReviewRequest reviewRequest) {
        return userService.getUserByAuthentication()
            .map(
                user-> reviewService.createReview(user, reviewRequest)
            )
            .map(
                review-> ResponseEntity.ok(review)
            )
            .orElse(
                ResponseEntity.badRequest().build()
            );
    }

    // Get Review by ID
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable int id) {
        Optional<Review> review = reviewService.getReviewById(id);
        return review.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get all Reviews for a User
    @GetMapping("/user")
    public ResponseEntity<List<Review>> getReviewsByUser(@RequestAttribute UserDetails userDetails) {
        List<Review> reviews = reviewService.getReviewsByUser(userDetails.getUsername());
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

    // Respond to review
    @PatchMapping("/{id}")
    public ResponseEntity<Review> respondToReview(@PathVariable int id, @RequestBody ReviewResponseRequest request) {
        var user = userService.getUserByAuthentication()
            .orElseThrow(
                ()->new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You need to login before you can respond to reviews")
            );

        return ResponseEntity.ok(reviewService.respondToReview(id, user, request));
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


