import { RoomType } from "./RoomType";

export default interface IRoom {
    id: number,
    roomNumber: string,
    roomType: RoomType,
    pricePerNight: number,
    maxGuests: number,
    images: Array<string>,
}
