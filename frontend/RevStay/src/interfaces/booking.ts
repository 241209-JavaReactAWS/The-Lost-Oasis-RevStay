export default interface Booking {
    id: number,
    customer: {userId: number, firstName: string, lastName: string, email: string},
    room: {id: number, roomNumber: string},
    checkIn: string,
    checkOut: string,
    numGuests: number,
    totalPrice: number,
    status: "PENDING"|"CONFIRMED"|"REJECTED"|"USER_CANCELED"|"OWNER_CANCELED"
}
