package com.Revature.RevStay.daos;

import com.Revature.RevStay.models.Booking;
import com.Revature.RevStay.models.Hotel;
import com.Revature.RevStay.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findAllByCustomer(User customer);
    List<Booking> findAllByHotelId(int hotelId);
}
