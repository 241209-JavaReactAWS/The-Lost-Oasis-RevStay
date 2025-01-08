package com.Revature.RevStay.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkRoomCreationDTO {
    private String roomType;
    private Integer count;
    private Double pricePerNight;
}
