import { useState } from 'react'
import "./review.css"
import { postman } from '../../postman'
import {Button, Dialog, DialogContent, DialogTitle, Stack, TextField, Typography} from '@mui/material'


interface ReviewProps{
    hotelId: number,
    isHidden: boolean,
    setHidden: (val: boolean) => void,
}

export default function ReviewPopup(props: ReviewProps){
    const [rating, setRating] = useState(0)
    const [suggestedRating, setSuggestedRating] = useState(0)
    const [text, setText] = useState("")

    return <Dialog open={!props.isHidden} onClose={() => props.setHidden(true)}>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
            <Typography textAlign='center'>Stars</Typography>
            <div id="stars">
                {
                    [1, 2, 3, 4, 5].map(i =>
                        <Star
                            key={i}
                            shouldDisplay={
                                (suggestedRating == 0) ? i <= rating : i <= suggestedRating
                            }
                            onClick={
                                () => setRating(i)
                            }
                            onMouseIn={
                                () => setSuggestedRating(i)
                            }
                            onMouseOut={
                                () => setSuggestedRating(0)
                            }
                        />
                    )
                }
            </div>
            <TextField fullWidth label="Description" multiline rows={4} onChange={e => setText(e.target.value)}/>
            <Stack sx={{mt: 1}}>
                <Button sx={{m: 'auto'}} onClick={() => {
                    submit(props.hotelId, rating, text)
                    props.setHidden(true)
                }} variant='contained'>Submit</Button>
            </Stack>
        </DialogContent>
    </Dialog>
}

function submit(hotelId: number, rating: number, description: string) {
    if (rating == 0) {
        alert('Please select a rating')
        return
    }

    const body = {
        hotelId: hotelId,
        rating: rating,
        comment: description
    }

    console.log(body)

    postman.post(
        '/reviews',
        body
    )
}

type StarProps = {
    shouldDisplay: boolean,
    onClick: () => void,
    onMouseIn: () => void,
    onMouseOut: () => void
}

function Star(props: StarProps) {
    return (
        <span
            className="star"
            onClick={
                () => props.onClick()
            }
            onMouseEnter={
                () => props.onMouseIn()
            }
            onMouseLeave={
                () => props.onMouseOut()
            }
        >
        {props.shouldDisplay ? '★' : '☆'}
        </span>
    )
}
