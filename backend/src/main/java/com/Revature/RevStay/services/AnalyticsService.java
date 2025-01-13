package com.Revature.RevStay.services;

import com.Revature.RevStay.daos.BookingRepository;
import com.Revature.RevStay.models.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsService {
private final BookingRepository bookingRepository;

@Autowired
public AnalyticsService(BookingRepository bookingRepository) {
    this.bookingRepository = bookingRepository;
}

public Map<String, Object> getOwnerAnalytics(long ownerId) {
    Map<String, Object> analytics = new HashMap<>();
    analytics.put("totalBookings", bookingRepository.countBookingsByOwner(ownerId, UserRole.OWNER));
    analytics.put("totalRevenue", bookingRepository.sumTotalRevenueByOwner(ownerId, UserRole.OWNER));
    analytics.put("totalGuests", bookingRepository.sumTotalDaysBooked(ownerId, UserRole.OWNER.name()));
    return analytics;

    }
}
