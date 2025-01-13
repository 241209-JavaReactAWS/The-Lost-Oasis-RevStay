package com.Revature.RevStay.daos;

import com.Revature.RevStay.models.Booking;
import com.Revature.RevStay.models.Hotel;
import com.Revature.RevStay.models.User;
import com.Revature.RevStay.models.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findAllByCustomer(User customer);
    List<Booking> findAllByHotelId(int hotelId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.hotel.owner.userId = :userId AND b.hotel.owner.role = :role")
    Long countBookingsByOwner(@Param("userId") Long userId, @Param("role") UserRole role);


    @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE b.hotel.owner.userId = :userId AND b.hotel.owner.role = :ownerRole")
    Double sumTotalRevenueByOwner(@Param("userId") Long userId, @Param("ownerRole") UserRole ownerRole);

    @Query(value = """
    SELECT SUM(EXTRACT(DAY FROM (b.check_out - b.check_in)))
    FROM Bookings b
    WHERE b.customer_user_id = :userId AND b.status = :status 
""", nativeQuery = true )
    Double sumTotalDaysBooked(@Param("userId") Long userId, @Param("status") String status);





}
