import IReview from '../../interfaces/IReview.ts'
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
                {
                    props.response?.trim()?.length ?? 0 > 0 ?
                    <>
                    <br/>
                    <Typography>{props.response}</Typography>
                    <Typography>- Owner</Typography>
                    </>
                    :
                    <></>
                }
            </Stack>
        </CardContent>
    </Card>
}
