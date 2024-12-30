package com.Revature.RevStay.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "bookings")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Hotel hotel;

    @ManyToOne
    private Room room;

    private LocalDate checkIn;
    private LocalDate checkOut;
    private Double totalPrice;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;
}
