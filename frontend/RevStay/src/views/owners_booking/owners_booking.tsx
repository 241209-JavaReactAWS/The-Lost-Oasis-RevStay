import {useCallback, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import { postman } from "../../postman"
import AdminTable from "../../components/admin_table/admin_table"


export default function OwnersBooking(){
    const [bookings, setBookings] = useState<Booking[]>([])
    const [reviews, setReviews] = useState<Review[]>([])

    const {hotelId} = useParams<{hotelId: string}>()

    const fetch = useCallback(() => {
        const loadBookings = async ()=>{
            const bookings: Booking[] = (await postman.get(`/bookings/hotel/${hotelId}`)).data

            bookings.sort((a, b)=>a.id - b.id)

            setBookings(bookings)
        }

        const loadReviews = async ()=>{
            const reviews: Review[] = (await postman.get(`/reviews/hotel/${hotelId}`)).data

            reviews.sort((a, b)=>a.reviewId - b.reviewId)

            setReviews(reviews)
        }

        loadBookings()
        loadReviews()
    }, [hotelId])

    useEffect(()=>{
        fetch()
        const interval = setInterval(fetch, 5000)

        return () => {
            clearInterval(interval)
        }
    }, [fetch])

    const tables = {
        "Needs Confirmation Or Rejection": (
            <BookingTable
                objs={
                    bookings.filter(b=>b.status === "PENDING")
                }

                extraActions={{
                    "Confirm": (anyChanges, b)=>{
                        console.log(
                            {
                                ...b,
                                status: "ACCEPTED"
                            }
                        )

                        postman.patch(
                            `/bookings`, 
                            {
                                ...b,
                                status: "CONFIRMED"
                            }
                        )
                    },
                    "Reject": (anyChanges, b)=>{
                        postman.patch(
                            `/bookings`, 
                            {
                                ...b,
                                status: "REJECTED"
                            }
                        )
                    },
                }}
            />
        ),
        "Needs Response": (
            <ReviewTable
                objs={
                    reviews.filter(r=>r.response === null && r.comment.length > 0)
                }            
                extraActions={{
                    "IGNORE": (anyChange, newR)=>{
                        postman.patch(
                            `/reviews/${newR.reviewId}`, 
                            {response: ""}
                        )
                    },
                    "RESPOND": (anyChange, newR)=>{
                        if (newR.response == null || newR.response!.length === 0){
                            alert("Please enter a response")
                            return
                        }

                        postman.patch(
                            `/reviews/${newR.reviewId}`, 
                            {response: newR.response}
                        )
                    }
                }}
            />
        ),
        "Confirmed": (
            <BookingTable
                objs={
                    bookings.filter(b=>b.status === "CONFIRMED")
                }

                extraActions={{
                    "Cancel": (anyChanges, b)=>{
                        if (anyChanges){
                            alert("there are unsaved changes")
                            return
                        }

                        postman.patch(
                            `/bookings`, 
                            {
                                ...b,
                                status: "OWNER_CANCELED"
                            }
                        )
                    }
                }}
            />
        ),
        "Owner Cancelled": (
            <BookingTable
                objs={
                    bookings.filter(b=>b.status === "OWNER_CANCELED")
                }

                extraActions={{  
                }}
            />
        ),
        "User Cancelled": (
            <BookingTable
                objs={
                    bookings.filter(b=>b.status === "USER_CANCELED")
                }

                extraActions={{  
                }}
            />
        ),
        "Rejected": (
            <BookingTable
                objs={
                    bookings.filter(b=>b.status === "REJECTED")
                }
                extraActions={{
                }}
            />
        ),
        "All Reviews": (
            <ReviewTable
                objs={
                    reviews
                }            

                extraActions={{}}
            />
        ),
    }

    const wrappedTables = Object.entries(tables)
        .map(([name, table], i)=>(
                <TableWrapper 
                    key={i} 
                    name={name}
                    children={table}
                />
            )
        )

    return wrappedTables
}

interface TableWrapperProps{
    name: string,
    children: any,
}
function TableWrapper(props: TableWrapperProps){
    const [isHidden, setHidden] = useState(true)

    return (
        <div>
            <div>
                <label>{props.name}</label>
                <button
                    onClick={()=>setHidden(!isHidden)}
                    children={isHidden ? "reveal" : "hide"} 
                />
            </div>
            <div style={isHidden? {display: "none"} : {}}>
                {props.children}
            </div>
        </div>
    )
}

type BookingTableProps = {
    objs: Booking[],
    extraActions: {
        [key: string]: (anyChanges: boolean, b: Booking)=>void
    } 
}
function BookingTable(props: BookingTableProps){
    return (
        <AdminTable<Booking>
            objs={props.objs}
            headers={
                {
                    "Id": [
                        t=>t.id.toString(),
                        null
                    ],
                    "Customer": [
                        t=> t.customer.userId + " " + t.customer.firstName + " " + t.customer.lastName + " " + t.customer.email,
                        null
                    ],
                    "Check-in Date": [
                        t=>t.checkIn, 
                        (t, arg)=>{ 
                            return {...t, checkIn: arg}
                        }
                    ],
                    "Check-out Date": [
                        t=>t.checkOut, 
                        (t, arg)=>{ 
                            return {...t, checkOut: arg}
                        }
                    ],
                    "Room ID": [
                        t=>t.room.id.toString(), 
                        (t, arg)=>{ 
                            return {...t, room: {...t.room, id: parseInt(arg)}}
                        }
                    ],
                    "Room Number": [
                        t=>t.room.roomNumber,
                        null
                    ],
                    "Number of Guests": [
                        t=>t.numGuests.toString(), 
                        (t, arg)=>{ 
                            return {...t, numGuests: parseInt(arg)}
                        }
                    ],
                    "Price": [
                        t=>t.totalPrice.toString(), 
                        (t, arg)=>{ 
                            return {...t, totalPrice: parseFloat(arg)}
                        }
                    ],
                }
            }
            actions={
                {
                    "EDIT": (anyChange, newB)=>{
                        if (!anyChange){
                            alert("there are no changes")
                        }
                        else {
                            postman.patch(`bookings`, newB)
                        }
                    },
                    ...props.extraActions,
                }
            }
        />
    )
}

type ReviewTableProps = {
    objs: Review[],
    extraActions: {
        [key: string]: (anyChanges: boolean, b: Review)=>void
    } 
}
function ReviewTable(props: ReviewTableProps){
    return (
        <AdminTable<Review>
            objs={props.objs}
            headers={{
                "Id": [
                    t=>t.reviewId.toString(),
                    null
                ],
                "Customer": [
                    t=> t.user.userId + " " + t.user.firstName + " " + t.user.lastName + " " + t.user.email,
                    null
                ],
                "Rating": [
                    t=>t.rating.toString(),
                    null
                ],
                "Comment": [
                    t=>t.comment,
                    null
                ],
                "Response": [
                    t=>String(t.response),
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
        />
    )
}

interface Booking {
    id: number,
    customer: {userId: number, firstName: string, lastName: string, email: string},
    room: {id: number, roomNumber: string},
    checkIn: string,
    checkOut: string,
    numGuests: number,
    totalPrice: number,
    status: "PENDING"|"CONFIRMED"|"REJECTED"|"USER_CANCELED"|"OWNER_CANCELED"
}

interface Review{
    reviewId: number,
    user: {userId: number, firstName: string, lastName: string, email: string},
    rating: number,
    comment: string
    response: string|null
}