import IUser from "./IUser"

export default interface IReview{
    id: number,
    user: IUser,
    rating: number,
    comment: string
    response: string|null
}