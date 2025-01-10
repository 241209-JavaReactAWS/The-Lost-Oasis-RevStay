package com.Revature.RevStay.services;

import com.Revature.RevStay.daos.HotelRepository;
import com.Revature.RevStay.daos.RoomRepository;
import com.Revature.RevStay.models.Room;
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
import java.util.Optional;
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

    public Hotel createHotel(Hotel hotel, List<MultipartFile> images, Long userId) {
        // Set owner
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        hotel.setOwner(owner);

        System.out.println("Hotel Owner: " + hotel.getOwner());

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

    public Room addRoomToHotel(Integer hotelId, Room room) {
        Optional<Hotel> hotelOptional = hotelRepository.findById(hotelId);

        if (hotelOptional.isPresent()) {
            Hotel hotel = hotelOptional.get();
            room.setHotel(hotel);
            return roomRepository.save(room);
        }


        return null;
    }

    public Room updateRoomDetails(Integer roomId, Room updatedRoom) {
        Optional<Room> roomOptional = roomRepository.findById(roomId);

        if (roomOptional.isPresent()) {
            Room existingRoom = roomOptional.get();
            existingRoom.setPricePerNight(updatedRoom.getPricePerNight());
            existingRoom.setIsAvailable(updatedRoom.getIsAvailable());
            existingRoom.setStatus(updatedRoom.getStatus());
            return roomRepository.save(existingRoom);
        }

        // Return null or handle the case where the room is not found
        return null;
    }

}

