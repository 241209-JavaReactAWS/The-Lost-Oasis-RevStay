package com.Revature.RevStay.services;

import com.Revature.RevStay.daos.HotelRepository;
import com.Revature.RevStay.daos.RoomRepository;
import com.Revature.RevStay.dtos.RoomRequest;
import com.Revature.RevStay.models.Hotel;
import com.Revature.RevStay.models.Room;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {
    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;
    private final UserService userService;
    private final FileStorageService fileStorageService;

    @Value("${aws.bucket.url}")
    private String AWS_BUCKET_URL;

    public RoomService(RoomRepository roomRepository,
                       HotelRepository hotelRepository,
                       UserService userService,
                       FileStorageService fileStorageService) {
        this.roomRepository = roomRepository;
        this.hotelRepository = hotelRepository;
        this.userService = userService;
        this.fileStorageService = fileStorageService;
    }


    public Room addRoom(Integer hotelId, RoomRequest request, List<MultipartFile> images, String ownerEmail) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        // Verify that the user is the owner of the hotel
        Long ownerId = userService.getUserIdByEmail(ownerEmail);
        if (hotel.getOwner().getUserId() != ownerId) {
            throw new RuntimeException("User is not authorized to add rooms to this hotel");
        }

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

        Room room = new Room();
        room.setHotel(hotel);
        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType()); // Directly set the RoomType enum
        room.setPricePerNight(request.getPricePerNight());
        room.setTotalRooms(request.getTotalRooms());
        room.setAvailableRooms(request.getTotalRooms());
        room.setIsAvailable(true);
        room.setStatus(request.getStatus());
        room.setImages(imageUrls);

        return roomRepository.save(room);
    }

    public List<Room> getRoomsByHotelId(Integer hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
        return roomRepository.findByHotel(hotel);
    }

    // Method to get room with presigned URLs for images
    public Room getRoomWithImages(Integer roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }
}
