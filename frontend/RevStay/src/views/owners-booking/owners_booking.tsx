import {useCallback, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import { postman } from "../../postman"
import AdminTable from "../../components/admin_table/admin_table"
import Hider from "../../components/hider/hider";
import Booking from "../../interfaces/booking";
import { Alert } from "@mui/material";


export default function OwnersBooking(){
    const {hotelId} = useParams<{hotelId: string}>()
    
    const [bookings, setBookings] = useState<Booking[]>([])

    const [success, setSuccess] = useState<string|null>(null)
    const [error, setError] = useState<string|null>(null)

    const fetch = () => {
        postman.get(`/bookings/hotel/${hotelId}`, {timeout: 1000})
            .then(
                it=>it.data as Booking[]
            )
            .then(
                it=>it.sort((a, b)=>a.id - b.id)
            )
            .then(
                it=>setBookings(it)
            )
            .catch(
                ()=>setError("Error while fetching books")
            )
    }

    useEffect(()=>{
        fetch()
        const interval = setInterval(fetch, 5000)

        return () => {
            clearInterval(interval)
        }
    }, [fetch])

    const runTempError = (message: string)=>{
        setError(message)

        setTimeout(()=>setError(null), 3000)
    }

    const runTempSuccess = ()=>{
        setSuccess("Success!")
        setTimeout(()=>setSuccess(null), 3000)
    }

    return (
        <>
            {error != null ? <Alert severity="error">{error}</Alert> : <></>}
            {success != null ? <Alert severity="success">{success}</Alert> : <></>}
            <BookingTable
                name = "Needs Confirmation Or Rejection"
                objs={
                    bookings.filter(b=>b.status === "PENDING")
                }

                extraActions={{
                    "CONFIRM": (anyChanges, b)=>{
                        if (anyChanges){
                            alert("There are unsaved changes")
                            return
                        }

                        postman.patch(
                            `/bookings`, 
                            {
                                ...b,
                                status: "CONFIRMED"
                            }
                        )
                        .then(
                            ()=>runTempSuccess()
                        )
                        .catch(
                            ()=>runTempError("Error confirming booking")
                        )
                    },
                    "REJECT": (anyChanges, b)=>{
                        if (anyChanges){
                            alert("There are unsaved changes!")
                            return
                        }

                        postman.patch(
                            `/bookings`, 
                            {
                                ...b,
                                status: "REJECTED"
                            }
                        )
                        .then(
                            ()=>runTempSuccess()
                        )
                        .catch(
                            ()=>runTempError("Error rejecting booking")
                        )
                    },
                }}

                setError={runTempError}
                setSuccess={runTempSuccess}
            />
            <BookingTable
                name="Confirmed"
                objs={
                    bookings.filter(b=>b.status === "CONFIRMED")
                }

                extraActions={{
                    "CANCEL": (anyChanges, b)=>{
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
                        .catch(()=>{
                            setError("Error cancelling booking request")
                            setTimeout(()=>{setError(null)}, 1)
                        })
                    }
                }}

                setError={runTempError}
                setSuccess={runTempSuccess}
            />
            <BookingTable
                name="Owner Cancelled"
                objs={
                    bookings.filter(b=>b.status === "OWNER_CANCELED")
                }

                extraActions={{  
                }}

                setError={runTempError}
                setSuccess={runTempSuccess}
            />
            <BookingTable
                name="User Cancelled"
                objs={
                    bookings.filter(b=>b.status === "USER_CANCELED")
                }

                extraActions={{  
                }}

                setError={runTempError}
                setSuccess={runTempSuccess}
            />
            <BookingTable
                name="Rejected"
                objs={
                    bookings.filter(b=>b.status === "REJECTED")
                }
                extraActions={{
                }}

                setError={runTempError}
                setSuccess={runTempSuccess}
            />
        </>
    )
}

type BookingTableProps = {
    name: string,
    objs: Booking[],
    setError: (_: string)=>void,
    setSuccess: ()=>void,
    extraActions: {
        [key: string]: (anyChanges: boolean, b: Booking)=>void
    } 
}
function BookingTable(props: BookingTableProps){
    return (
        <Hider name={props.name}>
            <AdminTable<Booking>
            objs={props.objs}
            headers={
                {
                    "Id": [
                        t=>t.id?.toString(),
                        null
                    ],
                    "Customer": [
                        t=> t.customer?.userId + " " + t.customer?.firstName + " " + t.customer?.lastName + " " + t.customer?.email,
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
                        t=>t.room?.id?.toString(), 
                        (t, arg)=>{ 
                            return {...t, room: {...t.room, id: parseInt(arg)}}
                        }
                    ],
                    "Room#": [
                        t=>t.room?.roomNumber,
                        null
                    ],
                    "# of Guests": [
                        t=>t.numGuests?.toString(), 
                        (t, arg)=>{ 
                            return {...t, numGuests: parseInt(arg)}
                        }
                    ],
                    "Price": [
                        t=>t.totalPrice?.toString(), 
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
                            postman
                                .patch(`bookings`, newB)
                                .then(()=>{
                                    props.setSuccess()
                                })
                                .catch(()=>{
                                    props.setError("Error editing booking request")
                                })
                        }
                    },
                    ...props.extraActions,
                }
            }
            getKey={t=>t.id}
        />
        </Hider>
    )
}