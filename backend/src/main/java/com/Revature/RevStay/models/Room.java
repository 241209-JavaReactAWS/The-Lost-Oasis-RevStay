//package com.Revature.RevStay.models;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//@Entity
//@Table(name = "rooms")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class Room {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Integer id;
//
//    @ManyToOne
//    private Hotel hotel;
//
//    private String roomType;
//    private Double pricePerNight;
//}
