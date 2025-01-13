package com.Revature.RevStay.daos;

import com.Revature.RevStay.models.Hotel;
import com.Revature.RevStay.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Integer> {
    Optional<Hotel> findByOwner(User owner);

    List<Hotel> findByOwner_userId(Long ownerId);

    @Query("SELECT h FROM Hotel h JOIN h.rooms r WHERE r.pricePerNight BETWEEN :minPrice AND :maxPrice")
    List<Hotel> findByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
}

