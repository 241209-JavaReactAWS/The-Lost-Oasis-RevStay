package com.Revature.RevStay.services;

import java.util.List;
import java.util.Optional;

import com.Revature.RevStay.daos.HotelRepository;
import com.Revature.RevStay.daos.UserRepository;
import com.Revature.RevStay.dtos.ReviewRequest;
import com.Revature.RevStay.dtos.ReviewResponseRequest;
import com.Revature.RevStay.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import com.Revature.RevStay.models.Review;
import com.Revature.RevStay.daos.ReviewRepository;


import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final NotificationService notificationService;
	
    @Autowired
    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository, HotelRepository hotelRepository, NotificationService notificationService) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.hotelRepository = hotelRepository;
        this.notificationService = notificationService;
    }

    // Create or Save a Review
    public Review createReview(User user, ReviewRequest request) {
        var hotel = hotelRepository.findById(request.getHotelId())
                                   .orElseThrow(() -> new ResponseStatusException(
                                       HttpStatus.BAD_REQUEST,
                                       "hotel not found"
                                   ));

        var review = new Review(null, user, hotel, request.getRating(), request.getComment(), null);

        notificationService.sendNotification(hotel.getOwner(),
                 "New Review",
                 "%s has posted a review with %d stars and with comment: %s".formatted(
                     review.getUser().getEmail(),
                     review.getRating(),
                     review.getComment()
                 )
        );

        review = this.reviewRepository.save(review);
        hotel.getReviews().add(review);
        this.hotelRepository.save(hotel);
        return review;
    }

    public Review respondToReview(int reviewId, User owner, ReviewResponseRequest request){
        var review = reviewRepository
            .findById(reviewId)
            .orElseThrow(
                ()->new ResponseStatusException(HttpStatus.NOT_FOUND, "Review Not Found")
            );

        if (review.getHotel().getOwner().getUserId() != owner.getUserId()){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "You are not owner of the hotel this user has reviewed");
        }

        if (review.getResponse() != null){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Review already has response");
        }

        var newResponse = new Review(
            review.getReviewId(),
            review.getUser(),
            review.getHotel(),
            review.getRating(),
            review.getComment(),
            request.getResponse()
        );

        return reviewRepository.save(newResponse);
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
