import IRoom from '../../interfaces/IRoom.ts';
import IHotel from '../../views/hotel/IHotel.ts'

export default interface Booking {
    id: number,
    hotel: IHotel,
    room: IRoom,
    checkIn: string,
    checkOut: string,
    totalPrice: number,
    numGuests: number,
    status: string,
}
