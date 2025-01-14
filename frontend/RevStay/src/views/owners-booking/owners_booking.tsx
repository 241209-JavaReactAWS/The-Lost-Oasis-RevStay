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
                ()=>console.log("Error while fetching books")
            )
    }

    useEffect(()=>{
        fetch()
        const interval = setInterval(fetch, 5000)

        return () => {
            clearInterval(interval)
        }
    }, [fetch])

    const runErrorAlert = (message: string)=>{
        setError(message)

        setTimeout(()=>setError(null), 3000)
    }

    const runSuccessAlert = ()=>{
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
                            ()=>runSuccessAlert()
                        )
                        .catch(
                            ()=>runErrorAlert("Error while confirming booking")
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
                            ()=>runSuccessAlert()
                        )
                        .catch(
                            ()=>runErrorAlert("Error while rejecting booking")
                        )
                    },
                }}

                runErrorAlert={runErrorAlert}
                runSuccessAlert={runSuccessAlert}
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
                        .then(
                            ()=>runSuccessAlert()
                        )
                        .catch(()=>{
                            runErrorAlert("Error while cancelling booking request")
                        })
                    }
                }}

                runErrorAlert={runErrorAlert}
                runSuccessAlert={runSuccessAlert}
            />
            <BookingTable
                name="Owner Cancelled"
                objs={
                    bookings.filter(b=>b.status === "OWNER_CANCELED")
                }

                extraActions={{  
                }}

                runErrorAlert={runErrorAlert}
                runSuccessAlert={runSuccessAlert}
            />
            <BookingTable
                name="User Cancelled"
                objs={
                    bookings.filter(b=>b.status === "USER_CANCELED")
                }

                extraActions={{  
                }}

                runErrorAlert={runErrorAlert}
                runSuccessAlert={runSuccessAlert}
            />
            <BookingTable
                name="Rejected"
                objs={
                    bookings.filter(b=>b.status === "REJECTED")
                }
                extraActions={{
                }}

                runErrorAlert={runErrorAlert}
                runSuccessAlert={runSuccessAlert}
            />
        </>
    )
}

type BookingTableProps = {
    name: string,
    objs: Booking[],
    runErrorAlert: (_: string)=>void,
    runSuccessAlert: ()=>void,
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
                            const num = parseInt(arg)
                            if (Number.isNaN(num)){
                                alert("Please input a valid number")
                                return null
                            }

                            return {...t, room: {...t.room, id: num}}
                        }
                    ],
                    "Room#": [
                        t=>t.room?.roomNumber,
                        null
                    ],
                    "# of Guests": [
                        t=>t.numGuests?.toString(), 
                        (t, arg)=>{ 
                            const num = parseInt(arg)
                            if (Number.isNaN(num)){
                                alert("Please input a valid number")
                                return null
                            }

                            return {...t, numGuests: num}
                        }
                    ],
                    "Price": [
                        t=>t.totalPrice?.toString(), 
                        (t, arg)=>{ 
                            const num = parseFloat(arg)
                            if (Number.isNaN(num)){
                                alert("Please input a valid number")
                                return null
                            }

                            return {...t, totalPrice: num}
                        }
                    ],
                }
            }
            actions={
                {
                    "EDIT": (anyChange, newB)=>{
                        if (!anyChange){
                            alert("There are no changes")
                            return
                        }
                        else {
                            postman
                                .patch(`bookings`, newB)
                                .then(()=>{
                                    props.runSuccessAlert()
                                })
                                .catch(()=>{
                                    props.runErrorAlert("Error while editing booking request")
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