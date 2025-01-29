export default interface IRoom {
    id: number,
    roomNumber: string,
    roomType: "SINGLE"|"DOUBLE"|"DELUXE"|"EXECUTIVE"|"FAMILY",
    pricePerNight: number,
    maxGuests: number,
    images: Array<string>,
}
