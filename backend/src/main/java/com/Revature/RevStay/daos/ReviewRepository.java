package com.Revature.RevStay.daos;

import com.Revature.RevStay.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByUserId(int userId);
    List<Review> findByHotelId(int hotelId);

}
