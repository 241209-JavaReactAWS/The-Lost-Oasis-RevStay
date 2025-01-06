package com.Revature.RevStay.models;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class BookingRequest {
    private int hotelID;
    private int roomID;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int numGuests;
}
