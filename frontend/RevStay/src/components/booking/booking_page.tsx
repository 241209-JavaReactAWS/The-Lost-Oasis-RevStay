import { useState } from "react"
import { Booking, Completed, InSession, Pending } from "./booking_type"
import Table from "../admin_table/admin_table"
import "./bookings.css"

export default function Bookings(){
    return (
        <div className="bookings">
            <h1>My Bookings</h1>

            <Entry<Pending>
                name = "Pending"

                headers={
                    ["hotelName", "room", "username", "dateIn"]
                }

                objs={
                    [
                        {
                          type: "pending",
                          hotelName: "Hotel Mario",
                          room: "123",
                          username: "mario",
                          dateIn: "12/12/12",
                          cost: "100",
                        },
                        {
                          type: "pending",
                          hotelName: "Overlook Hotel",
                          room: "237",
                          username: "jack",
                          dateIn: "12/12/12",
                          cost: "100",
                        },
                    ]
                }

                extraActions={
                    {
                        "accept": ()=>{},
                        "deny": ()=>{},
                    }
                }

                edit={
                    ()=>{}
                }

                delete={
                    ()=>{}
                }
            />


            <Entry<InSession>
                name = "Needs Response"

                headers={
                    ["hotelName", "room", "username", "dateIn"]
                }

                objs={
                    [
                        {
                          type: "inSession",
                          hotelName: "Hotel Mario",
                          room: "123",
                          username: "mario",
                          dateIn: "12/12/12",
                          cost: "100",
                        },
                        {
                          type: "inSession",
                          hotelName: "Overlook Hotel",
                          room: "237",
                          username: "jack",
                          dateIn: "12/12/12",
                          cost: "100",
                        },
                    ]
                }

                extraActions={
                    {
                        respond: ()=>{},
                        ignore: ()=>{}
                    }
                }

                edit={
                    ()=>{}
                }

                delete={
                    ()=>{}
                }
            />
            
            <Entry<InSession>
                name = "In Session"

                headers={
                    ["hotelName", "room", "username", "dateIn"]
                }

                objs={
                    [
                        {
                          type: "inSession",
                          hotelName: "Hotel Mario",
                          room: "123",
                          username: "mario",
                          dateIn: "12/12/12",
                          cost: "100",
                        },
                        {
                          type: "inSession",
                          hotelName: "Overlook Hotel",
                          room: "237",
                          username: "jack",
                          dateIn: "12/12/12",
                          cost: "100",
                        },
                    ]
                }

                extraActions={
                    {}
                }

                edit={
                    ()=>{}
                }

                delete={
                    ()=>{}
                }
            />

            <Entry<Completed>
                name = "Completed"

                headers={
                    ["hotelName", "room", "username", "dateIn"]
                }

                objs={
                    [
                        {
                          type: "completed",
                          hotelName: "Hotel Mario",
                          room: "123",
                          username: "mario",
                          dateIn: "12/12/12",
                          dateOut: "12/30/12",
                          cost: "100",
                        },
                        {
                          type: "completed",
                          hotelName: "Overlook Hotel",
                          room: "237",
                          username: "jack",
                          dateIn: "12/12/12",
                          dateOut: "12/30/12",
                          cost: "100",
                        },
                    ]
                }

                extraActions={
                    {}
                }

                edit={
                    ()=>{}
                }

                delete={
                    ()=>{}
                }
            />
        </div>

        
    )
}


type EntryProps<T extends Booking> = {
    name: string,
    headers: (keyof T & string)[]
    objs: T[],
    edit: (arg0: T)=>void,
    delete: (arg0: T)=>void
    extraActions: {
        [key: string]: (arg0: T)=>void
    } 
}
function Entry<T extends Booking>(props: EntryProps<T>){
    let [isHidden, setHidden] = useState(true)

    return (
        <div>
            <div>
                <label>{props.name}</label>
                <input 
                    type="button" 
                    value={isHidden ? "reveal" : "hide"} 
                    onClick={()=>setHidden(!isHidden)}
                />
            </div>
            <div style={isHidden? {display: "none"} : {}}>
                <Table
                    headers={props.headers}
                    objs={props.objs}
                    actions={
                        {
                            "edit": (oldT, newT)=>{
                                if (JSON.stringify(oldT) === JSON.stringify(newT)){
                                    alert("there are no changes")
                                }
                                else {
                                    props.edit(newT)
                                }
                            },
                            "delete": (oldT, newT)=>{
                                if (JSON.stringify(oldT) !== JSON.stringify(newT)){
                                    alert("there are unsaved changes")
                                }
                                else {
                                    props.delete(newT)
                                }
                            },
                            ...props.extraActions,
                        }
                    }
                />
            </div>
        </div>
    )
}