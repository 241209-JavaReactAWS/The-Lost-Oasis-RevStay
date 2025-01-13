package com.Revature.RevStay.daos;

import com.Revature.RevStay.models.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository

public interface SearchFilterRepository extends JpaRepository<Hotel, Integer>, JpaSpecificationExecutor<Hotel> {
    // No need for additional methods here unless you have specific custom queries


    @Query("SELECT h FROM Hotel h JOIN Room r on h = r.hotel WHERE r.pricePerNight BETWEEN :minPrice AND :maxPrice")
    List<Hotel> findByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
}
