package com.Revature.RevStay.services;

import com.Revature.RevStay.daos.HotelRepository;
import com.Revature.RevStay.daos.RoomRepository;
import com.Revature.RevStay.dtos.RoomRequest;
import com.Revature.RevStay.models.Hotel;
import com.Revature.RevStay.models.Room;
import com.Revature.RevStay.models.RoomStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

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
        room.setRoomType(request.getRoomType());
        room.setPricePerNight(request.getPricePerNight());
        room.setTotalRooms(request.getTotalRooms());
        room.setAvailableRooms(request.getTotalRooms());
        room.setIsAvailable(request.getStatus() == RoomStatus.AVAILABLE); // Set based on status
        room.setStatus(request.getStatus());
        room.setImages(imageUrls);

        return roomRepository.save(room);
    }

    public List<Room> getRoomsByHotelId(Integer hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
        return roomRepository.findByHotel(hotel);
    }

    public void deleteRoom(Integer roomId, String ownerEmail) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // Verify ownership
        Long ownerId = userService.getUserIdByEmail(ownerEmail);
        if (room.getHotel().getOwner().getUserId() != ownerId) {
            throw new RuntimeException("User is not authorized to delete this room");
        }

        // Delete images from S3
        if (room.getImages() != null && !room.getImages().isEmpty()) {
            room.getImages().forEach(imageUrl -> {
                try {
                    String key = imageUrl.replace(AWS_BUCKET_URL + "/", "");
                    fileStorageService.deleteFile(key);
                } catch (Exception e) {
                    System.out.println("Failed to delete image: " + imageUrl + e);
                }
            });
        }

        roomRepository.delete(room);
    }

    public Room updateRoom(
            Integer hotelId,
            Integer roomId,
            RoomRequest request,
            List<MultipartFile> newImages,
            List<String> deletedImages,
            String ownerEmail
    ) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.getHotel().getId().equals(hotelId)) {
            throw new RuntimeException("Room does not belong to this hotel");
        }

        // Verify ownership
        Long ownerId = userService.getUserIdByEmail(ownerEmail);
        if (room.getHotel().getOwner().getUserId() != ownerId) {
            throw new RuntimeException("User is not authorized to update this room");
        }

        // Update basic information
        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType());
        room.setPricePerNight(request.getPricePerNight());
        room.setTotalRooms(request.getTotalRooms());
        room.setStatus(request.getStatus());
        room.setIsAvailable(request.getStatus() == RoomStatus.AVAILABLE);

        // Remove deleted images
        if (deletedImages != null && !deletedImages.isEmpty()) {
            List<String> updatedImages = new ArrayList<>(room.getImages());

            for (String imageUrl : deletedImages) {
                try {
                    // Get the key by removing the AWS bucket URL
                    String key = imageUrl.replace(AWS_BUCKET_URL + "/", "");
                    fileStorageService.deleteFile(key);
                    updatedImages.remove(imageUrl); // Remove from the list after successful deletion
                } catch (Exception e) {
                    System.out.println("Failed to delete image: " + imageUrl + e);
                }
            }

            room.setImages(updatedImages);
        }

        // Add new images
        if (newImages != null && !newImages.isEmpty()) {
            for (MultipartFile image : newImages) {
                try {
                    String imageKey = fileStorageService.saveFile(image);
                    String imageUrl = "%s/%s".formatted(AWS_BUCKET_URL, imageKey);
                    room.getImages().add(imageUrl);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to process new image", e);
                }
            }
        }

        return roomRepository.save(room);
    }
}
