import { useEffect, useState } from "react"
import { useParams } from 'react-router-dom';
import { postman } from "../../postman"
import AdminTable from "../../components/admin_table/admin_table"
import Hider from "../../components/hider/hider";
import Review from "../../interfaces/review";
import { Alert } from "@mui/material";


export default function OwnersReview(){
    const {hotelId} = useParams<{hotelId: string}>()

    const [reviews, setReviews] = useState<Review[]>([])

    const [success, setSuccess] = useState<string|null>(null)
    const [error, setError] = useState<string|null>(null)

    const fetch = ()=>{
        postman.get(`/reviews/hotel/${hotelId}`, {timeout: 1000})
            .then(
                it=>it.data as Review[]
            )
            .then(
                it=>it.sort((a, b)=>a.reviewId - b.reviewId)
            )
            .then(
                it=>setReviews(it)
            )
            .catch(
                ()=>console.log("Error while fetching reviews")
            )
    }

    useEffect(()=>{
            fetch()
            setInterval(fetch, 1000)
        }, 
        []
    )

    const runErrorAlert = (message: string)=>{
        setError(message)

        setTimeout(()=>{setError(null)}, 3000)
    }
    const runSuccessAlert = ()=>{
        setSuccess("Success!")
        setTimeout(()=>setSuccess(null), 3000)
    }

    return (
        <>
            {error != null ? <Alert severity="error">{error}</Alert> : <></>}
            {success != null ? <Alert severity="success">{success}</Alert> : <></>}
            <ReviewTable
                name="Needs Response"
                objs={
                    reviews.filter(r=>r.response === null && r.comment.length > 0)
                }            
                extraActions={{
                    "IGNORE": (anyChanges, newR)=>{
                        postman.patch(
                            `/reviews/${newR.reviewId}`, 
                            {response: ""}
                        )
                        .then(
                            ()=>runSuccessAlert()
                        )
                        .catch(
                            ()=>runErrorAlert("Error while ignoring review")
                        )

                    },
                    "RESPOND": (anyChanges, newR)=>{
                        if (!anyChanges || newR.response!.length === 0){
                            alert("Please enter a response!")
                            return
                        }

                        postman.patch(
                            `/reviews/${newR.reviewId}`, 
                            {response: newR.response}
                        )
                        .then(
                            ()=>runSuccessAlert()
                        )
                        .catch(
                            ()=>runErrorAlert("Error while responding to reviews")
                        )
                    }
                }}         
            />
            
            <ReviewTable
                name="All Reviews"
                objs={
                    reviews
                }            
                extraActions={{}}
            />
        </>
    )
}

type ReviewTableProps = {
    name: string,
    objs: Review[],
    extraActions: {
        [key: string]: (anyChanges: boolean, b: Review)=>void
    } 
}
function ReviewTable(props: ReviewTableProps){
    return (
        <Hider name={props.name}>
            <AdminTable<Review>
                objs={props.objs}
                headers={{
                    "Id": [
                        t=>t.reviewId?.toString(),
                        null
                    ],
                    "Customer": [
                        t=> t.user?.userId + " " + t.user?.firstName + " " + t.user?.lastName + " " + t.user?.email,
                        null
                    ],
                    "Rating": [
                        t=>"★".repeat(t.rating) + "☆".repeat(5 - t.rating),
                        null
                    ],
                    "Comment": [
                        t=>t.comment,
                        null
                    ],
                    "Response": [
                        t=>t.response ?? "",
                        (t, arg)=>{
                            return {...t, response: arg}
                        }
                    ]
                }}
                actions={
                    {
                        ...props.extraActions,
                    }
                }
                getKey={t=>t.reviewId}
            />
        </Hider>
    )
}

