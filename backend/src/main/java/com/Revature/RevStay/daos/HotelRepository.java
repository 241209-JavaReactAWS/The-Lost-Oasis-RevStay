package com.Revature.RevStay.daos;

import com.Revature.RevStay.models.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Integer> {
    Optional<Hotel> findByOwnerId(int userId);
}
