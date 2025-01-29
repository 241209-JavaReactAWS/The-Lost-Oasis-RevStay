package com.Revature.RevStay.models;

public enum RoomType {
    SINGLE(1),
    DOUBLE(2),
    SUITE(4),
    DELUXE(3),
    EXECUTIVE(2),
    FAMILY(6);

    final int maxGuests;

    RoomType(int maxGuests) {
        this.maxGuests = maxGuests;
    }
}
