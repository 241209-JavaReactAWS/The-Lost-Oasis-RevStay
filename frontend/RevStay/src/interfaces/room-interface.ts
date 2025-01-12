// types.ts
export enum RoomType {
    SINGLE = 'SINGLE',
    DOUBLE = 'DOUBLE',
    SUITE = 'SUITE',
    DELUXE = 'DELUXE',
    EXECUTIVE = 'EXECUTIVE',
    FAMILY = 'FAMILY'
}

export enum RoomStatus {
    AVAILABLE = 'AVAILABLE',
    OCCUPIED = 'OCCUPIED',
    UNDER_MAINTENANCE = 'UNDER_MAINTENANCE'
}

export interface Room {
    id: number;
    roomNumber: string;
    roomType: RoomType;
    pricePerNight: number;
    isAvailable: boolean;
    totalRooms: number;
    availableRooms: number;
    status: RoomStatus;
    images: string[];
}