interface Base{
    type: string
    hotelName: string,
    room: string,
    username: string,
    dateIn: string,
    cost: string,
}

export interface Pending extends Base{
    type:"pending"
}

export interface Denied extends Base{
    type: "denied"
}

export interface InSession extends Base{
    type: "inSession"
}

export interface Completed extends Base{
    type: "completed"
    dateOut: string
} 

export type Booking = Pending|Denied|InSession|Completed
