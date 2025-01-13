package com.Revature.RevStay.services;

import java.util.List;
import java.util.Optional;

import com.Revature.RevStay.daos.UserRepository;
import com.Revature.RevStay.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import com.Revature.RevStay.models.Review;
import com.Revature.RevStay.daos.ReviewRepository;



import org.springframework.stereotype.Service;
@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository, NotificationService notificationService) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    // Create or Save a Review
    public Review createReview(Review review) {
        this.notificationService.sendNotification(review.getHotel().getOwner(), "New Review", "A new review has been posted for your hotel");
        return reviewRepository.save(review);
    }

    // Find Review by ID
    public Optional<Review> getReviewById(int reviewId) {
        return reviewRepository.findById(reviewId);
    }

    // Find all Reviews for a specific User
    public List<Review> getReviewsByUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail);
        return reviewRepository.findByUser(user);
    }

    // Find all Reviews for a specific Hotel
    public List<Review> getReviewsByHotel(int hotelId) {
        return reviewRepository.findByHotelId(hotelId);
    }

    // Find all Reviews
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // Delete a Review
    public void deleteReview(int reviewId) {
        if (reviewRepository.existsById(reviewId)) {
            reviewRepository.deleteById(reviewId);
        } else {
            throw new ReviewNotFoundException("Review with ID " + reviewId + " not found");
        }
    }

    // Custom Exception for Review Not Found
    public static class ReviewNotFoundException extends RuntimeException {
        public ReviewNotFoundException(String message) {
            super(message);
        }
    }
}