package com.Revature.RevStay.specifications;

import com.Revature.RevStay.models.Hotel;
import org.springframework.data.jpa.domain.Specification;



public class HotelFilterSpecification {

    public static Specification<Hotel> hasCity(String city) {
        return (root, query, criteriaBuilder) ->
                city == null ? null : criteriaBuilder.equal(criteriaBuilder.lower(root.get("city")), city.toLowerCase());
    }

    public static Specification<Hotel> hasState(String state) {
        return (root, query, criteriaBuilder) ->
                state == null ? null : criteriaBuilder.equal(criteriaBuilder.lower(root.get("state")), state.toLowerCase());
    }

    public static Specification<Hotel> hasMinPrice(Double minPrice) {
        return (root, query, criteriaBuilder) ->
                minPrice == null ? null : criteriaBuilder.greaterThanOrEqualTo(root.join("rooms").get("pricePerNight"), minPrice);
    }

    public static Specification<Hotel> hasMaxPrice(Double maxPrice) {
        return (root, query, criteriaBuilder) ->
                maxPrice == null ? null : criteriaBuilder.lessThanOrEqualTo(root.join("rooms").get("pricePerNight"), maxPrice);
    }

    public static Specification<Hotel> hasAmenities(String amenities) {
        return (root, query, criteriaBuilder) ->
                amenities == null ? null : criteriaBuilder.like(criteriaBuilder.lower(root.get("amenities")), "%" + amenities.toLowerCase() + "%");
    }

    public static Specification<Hotel> hasMinRating(Integer minRating) {
        return (root, query, criteriaBuilder) ->
                minRating == null ? null : criteriaBuilder.greaterThanOrEqualTo(root.get("rating"), minRating);
    }
}
