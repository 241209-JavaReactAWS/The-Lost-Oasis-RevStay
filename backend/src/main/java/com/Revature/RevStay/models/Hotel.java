package com.Revature.RevStay.models;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "hotels")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JoinColumn(nullable = false)
    private String name;

    @JoinColumn(nullable = false)
    private String address;

    @JoinColumn(nullable = false)
    private String city;

    @JoinColumn(nullable = false)
    private String state;

    @Column(length = 10000)
    @JoinColumn(nullable = false)
    private String description;

    @JoinColumn(nullable = false)
    private String amenities;

    @ManyToOne
    @JoinColumn(nullable = false)
    private User owner;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL)
    private List<Room> rooms;

    @ElementCollection
    @Column(columnDefinition = "TEXT")
    private List<String> images;

    @OneToMany
    @JsonIgnore
    private List<Review> reviews;

    @JsonGetter("rating")
    public Double getRating() {
        if (reviews == null || reviews.isEmpty()) {
            return 0.0;
        } else {
            return reviews.stream().map(Review::getRating).reduce(0, Integer::sum) / (double) reviews.size();
        }
    }
}
