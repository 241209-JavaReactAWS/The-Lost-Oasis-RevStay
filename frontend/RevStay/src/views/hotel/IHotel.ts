import IRoom from "../../interfaces/IRoom";


export default interface IHotel {
    id: number,
    name: string,
    address: string,
    city: string,
    state: string,
    description: string,
    amenities: string,
    rooms: Array<IRoom>,
    images: Array<string>,
    rating: number,
}
