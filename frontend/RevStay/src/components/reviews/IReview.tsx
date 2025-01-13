interface User {
    firstName: string,
    lastName: string,
}

export default interface IReview {
    reviewId: number,
    user: User,
    rating: number,
    comment: string,
}
