import IReview from './IReview.tsx'
import {Card, CardContent, Stack, Typography} from '@mui/material'

export default function ReviewCard(props: IReview) {
    const name = `${props.user.firstName} ${props.user.lastName.charAt(0)}.`
    const stars = '★'.repeat(props.rating)

    return <Card variant='outlined' sx={{width: 200}}>
        <CardContent>
            <Stack direction='column'>
                <Typography>{stars}</Typography>
                <Typography>{props.comment}</Typography>
                <Typography>- {name}</Typography>
            </Stack>
        </CardContent>
    </Card>
}
