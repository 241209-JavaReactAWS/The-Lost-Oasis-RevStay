package com.Revature.RevStay.daos;

import com.Revature.RevStay.models.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Integer> {

    List<Hotel> findByOwner_id(long ownerId);

    @Query("SELECT h FROM Hotel h JOIN h.rooms r WHERE r.pricePerNight BETWEEN :minPrice AND :maxPrice")
    List<Hotel> findByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
}

