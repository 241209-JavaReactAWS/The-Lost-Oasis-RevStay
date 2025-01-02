package com.Revature.RevStay.models;

import jakarta.persistence.*;

@Entity
@Table(name = "rooms")

public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    private Hotel hotel;

    private String roomType;
    private Double pricePerNight;

    public Room(Integer id, Hotel hotel, String roomType, Double pricePerNight) {
        this.id = id;
        this.hotel = hotel;
        this.roomType = roomType;
        this.pricePerNight = pricePerNight;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Hotel getHotel() {
        return hotel;
    }

    public void setHotel(Hotel hotel) {
        this.hotel = hotel;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public Double getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(Double pricePerNight) {
        this.pricePerNight = pricePerNight;
    }
}