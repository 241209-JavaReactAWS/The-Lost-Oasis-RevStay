export default interface Review{
    reviewId: number,
    user: {userId: number, firstName: string, lastName: string, email: string},
    rating: number,
    comment: string
    response: string|null
}