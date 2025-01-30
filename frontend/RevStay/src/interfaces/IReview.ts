import IUser from "./IUser"

export default interface IReview{
    reviewId: number,
    user: IUser,
    rating: number,
    comment: string
    response: string|null
}