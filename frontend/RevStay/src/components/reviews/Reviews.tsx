import {Box, Paper, Stack, Typography} from '@mui/material'
import {useEffect, useState} from 'react'
import {postman} from '../../postman.ts'
import IReview from './IReview.tsx'
import ReviewCard from './ReviewCard.tsx'

interface Props {
    hotelId: number
}

export default function Reviews(props: Props) {
    const [reviews, setReviews] = useState<Array<IReview>>([])
    const [error, setError] = useState<boolean>(false)

    useEffect(() => {
        postman.get(`/reviews/hotel/${props.hotelId}`)
            .then(res => setReviews(res.data))
            .catch(() => setError(true))
    }, [props.hotelId])

    return <Box sx={{mt: 1}} >
        <Typography variant='h6'>Reviews ({reviews.length})</Typography>
        <Paper sx={{p: 2}}>
            <Stack direction='row' overflow='scroll' gap={5}>
                {error ? <Typography>An error occurred fetching the reviews.</Typography> : <>
                    {reviews && reviews.length === 0 && <Typography>No reviews available.</Typography>}
                    {reviews.map((review) => <ReviewCard key={review.reviewId} {...review} />)}
                </>}
            </Stack>
        </Paper>
    </Box>
}
