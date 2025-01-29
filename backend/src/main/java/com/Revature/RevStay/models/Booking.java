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
    @JoinColumn(nullable = false)
    private User customer;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Hotel hotel;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Room room;

    @JoinColumn(nullable = false)
    private LocalDate checkIn;

    @JoinColumn(nullable = false)
    private LocalDate checkOut;

    @JoinColumn(nullable = false)
    private Double totalPrice;

    @JoinColumn(nullable = false)
    private Integer numGuests;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;
}
