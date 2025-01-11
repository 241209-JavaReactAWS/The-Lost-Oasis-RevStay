import IHotel from '../../views/hotel/IHotel.ts'
import IRoom from '../room/IRoom.tsx'

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
