import { useState } from "react"
import "./hider.css"

interface HiderProps{
    name: string,
    children: any,
}
export default function Hider(props: HiderProps){
    const [isHidden, setHidden] = useState(true)

    return (
        <div className="hider">
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