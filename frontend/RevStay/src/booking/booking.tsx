import { Entry } from "./entry/entry"

export interface BookingProps{
    type: string
    hotelName: string,
    room: string,
    username: string,
    dateIn: string,
    cost: string,
}

export interface Pending extends BookingProps{
    type: "pending"

    deny(): void
    accept(): void
}

export interface Denied extends BookingProps{
    type: "denied"
}

export interface InSession extends BookingProps{
    type: "inSession"
}

export interface Completed extends BookingProps{
    type: "completed"

    dateOut: string

    respond?(): void
} 

export function Booking(props: Pending|Denied|InSession|Completed){
    return <table>
        <tr>
            <th>Hotel</th>
            <th>Room</th>
            <th>Date In</th>
            <th>Username</th>
            <th>Cost</th>
            <th colSpan={3}>Actions</th>
        </tr>
        <tr>
            <th><Entry initText={props.hotelName}/></th>
            <th><Entry initText={props.room}/></th>
            <th><Entry initText={props.dateIn}/></th>
            <th><Entry initText={props.username}/></th>
            <th><Entry initText={props.cost}/></th>
            <th><button>Edit</button></th>
            <th><button>Accept</button></th>
            <th><button>Deny</button></th>
        </tr>
    </table>
}