import IRoom from "./IRoom";
import IUser from "./IUser";

export default interface IBooking {
    id: number,
    customer: IUser,
    room: IRoom,
    checkIn: string,
    checkOut: string,
    numGuests: number,
    totalPrice: number,
    status: "PENDING"|"CONFIRMED"|"REJECTED"|"USER_CANCELED"|"OWNER_CANCELED"
}
