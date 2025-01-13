package com.Revature.RevStay.dtos;

import com.Revature.RevStay.models.RoomStatus;
import com.Revature.RevStay.models.RoomType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomRequest {
    private String roomNumber;
    private RoomType roomType;
    private Double pricePerNight;
    private Integer totalRooms;
    private RoomStatus status;
}
