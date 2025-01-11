package com.Revature.RevStay.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelRequest {
    private String name;
    private String address;
    private String city;
    private String state;
    private String description;
    private String amenities;

}
