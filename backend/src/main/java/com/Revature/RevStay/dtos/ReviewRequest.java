package com.Revature.RevStay.dtos;

import com.Revature.RevStay.models.Hotel;
import com.Revature.RevStay.models.Review;
import com.Revature.RevStay.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {
    private int hotelId;
    private int rating;
    private String comment;
}
