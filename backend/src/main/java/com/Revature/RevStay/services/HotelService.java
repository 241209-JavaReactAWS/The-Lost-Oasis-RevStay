package com.Revature.RevStay.services;

import com.Revature.RevStay.daos.HotelRepository;
import com.Revature.RevStay.daos.RoomRepository;
import com.Revature.RevStay.dtos.HotelRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.Revature.RevStay.daos.UserRepository;
import com.Revature.RevStay.models.Hotel;
import com.Revature.RevStay.models.User;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;


import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class HotelService {


    private final HotelRepository hotelRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final FileStorageService fileStorageService;
    private final S3Client s3Client;

    @Value("${aws.bucket.url}")
    private String AWS_BUCKET_URL;

    public HotelService(HotelRepository hotelRepository, UserRepository userRepository, RoomRepository roomRepository, FileStorageService fileStorageService, S3Client s3Client) {
        this.hotelRepository = hotelRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.fileStorageService = fileStorageService;
        this.s3Client = s3Client;
    }

    public Hotel createHotel(HotelRequest request, List<MultipartFile> images, Long userId) {
        Hotel hotel = new Hotel();
        hotel.setName(request.getName());
        hotel.setAddress(request.getAddress());
        hotel.setCity(request.getCity());
        hotel.setState(request.getState());
        hotel.setDescription(request.getDescription());
        hotel.setAmenities(request.getAmenities());

        // Set owner
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        hotel.setOwner(owner);

        // Process and save images
        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile image : images) {
            try {
                String imageUrl = fileStorageService.saveFile(image);
                imageUrls.add("%s/%s".formatted(AWS_BUCKET_URL, imageUrl));
            } catch (IOException e) {
                throw new RuntimeException("Failed to process image", e);
            }
        }

        hotel.setImages(imageUrls);
        return hotelRepository.save(hotel);
    }

    public Hotel getHotelWithImages(Integer hotelId) {
        return hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
    }

    public List<Hotel> getHotelsByUserId(Long userId) {
        return hotelRepository.findByOwner_userId(userId);
    }

    public Hotel updateHotel(
            Integer hotelId,
            HotelRequest request,
            List<MultipartFile> newImages,
            List<String> deletedImages,
            Long userId
    ) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        // Verify ownership
        if (hotel.getOwner().getUserId() != userId) {
            throw new RuntimeException("User is not authorized to update this hotel");
        }

        // Update basic information
        hotel.setName(request.getName());
        hotel.setAddress(request.getAddress());
        hotel.setCity(request.getCity());
        hotel.setState(request.getState());
        hotel.setDescription(request.getDescription());
        hotel.setAmenities(request.getAmenities());

        // Remove deleted images
        if (deletedImages != null && !deletedImages.isEmpty()) {
            hotel.setImages(
                    hotel.getImages().stream()
                            .filter(imageUrl -> !deletedImages.contains(imageUrl))
                            .collect(Collectors.toList())
            );

            // Delete from S3
            deletedImages.forEach(imageUrl -> {
                try {
                    String key = imageUrl.replace(AWS_BUCKET_URL + "/", "");
                    fileStorageService.deleteFile(key);
                } catch (Exception e) {
                    System.out.println("Failed to delete image: " + imageUrl + e);
                }
            });
        }

        // Add new images
        if (newImages != null && !newImages.isEmpty()) {
            List<String> newImageUrls = new ArrayList<>();
            for (MultipartFile image : newImages) {
                try {
                    String imageKey = fileStorageService.saveFile(image);
                    newImageUrls.add("%s/%s".formatted(AWS_BUCKET_URL, imageKey));
                } catch (IOException e) {
                    throw new RuntimeException("Failed to process new image", e);
                }
            }
            hotel.getImages().addAll(newImageUrls);
        }

        return hotelRepository.save(hotel);
    }

    public void deleteHotel(Integer hotelId, Long userId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        // Verify that the user is the owner of the hotel
        if (hotel.getOwner().getUserId() != userId) {
            throw new RuntimeException("User is not authorized to delete this hotel");
        }

        // Delete images from S3
        if (hotel.getImages() != null && !hotel.getImages().isEmpty()) {
            hotel.getImages().forEach(imageKey -> {
                try {
                    fileStorageService.deleteFile(imageKey);
                } catch (Exception e) {
                    System.out.println("Failed to delete image: " + imageKey + e);
                }
            });
        }

        hotelRepository.delete(hotel);
    }
}







