package com.Revature.RevStay.services;

import com.Revature.RevStay.daos.RoomRepository;
import com.Revature.RevStay.dtos.BulkRoomCreationDTO;
import com.Revature.RevStay.models.Hotel;
import com.Revature.RevStay.models.Room;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RoomService {
    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<Room> getRoomsByHotelId(Integer hotelId) {
        return roomRepository.findByHotelId(hotelId);
    }

    public Optional<Room> getRoomByIdAndHotelId(Integer roomId, Integer hotelId) {
        return roomRepository.findByHotelId(hotelId).stream()
                .filter(room -> room.getId().equals(roomId))
                .findFirst();
    }

    public Room saveRoom(Room room) {
        return roomRepository.save(room);
    }

    public void deleteRoom(Integer id) {
        roomRepository.deleteById(id);
    }

    public List<Room> createRoomsInBulk(Hotel hotel, List<BulkRoomCreationDTO> bulkRoomCreationDTOs) {
        List<Room> rooms = new ArrayList<>();
        for (BulkRoomCreationDTO dto : bulkRoomCreationDTOs) {
            for (int i = 0; i < dto.getCount(); i++) {
                Room room = new Room();
                room.setHotel(hotel);
                room.setRoomType(dto.getRoomType());
                room.setPricePerNight(dto.getPricePerNight());
                room.setRoomNumber(generateRoomNumber(hotel, dto.getRoomType(), i));
                rooms.add(room);
            }
        }
        return roomRepository.saveAll(rooms);
    }

    private String generateRoomNumber(Hotel hotel, String roomType, int index) {
        // This is a simple room number generation logic. Adjust as needed.
        return roomType.substring(0, 1).toUpperCase() + (index + 1);
    }
}
