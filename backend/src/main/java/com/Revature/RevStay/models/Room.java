package com.Revature.RevStay.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    @JsonIgnore
    private Hotel hotel;

    private String roomNumber;

    @Enumerated(EnumType.STRING)
    private RoomType roomType;

    private Double pricePerNight;
    private Boolean isAvailable;

//    private Integer totalRooms;
//    private Integer availableRooms;

    @Enumerated(EnumType.STRING)
    private RoomStatus status;

    @ElementCollection
    @Column(columnDefinition = "TEXT")
    private List<String> images = new ArrayList<>();

}
