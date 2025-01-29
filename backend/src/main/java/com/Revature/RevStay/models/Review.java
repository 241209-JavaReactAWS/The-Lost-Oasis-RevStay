package com.Revature.RevStay.models;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reviews") // Use plural naming convention for the table
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reviewId;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "hotelId", nullable = false)
    private Hotel hotel;

    @Column(nullable = false)
    private int rating;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String comment;

    @Nullable
    @Column(columnDefinition = "TEXT", nullable = true)
    private String response;
}