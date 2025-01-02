import { useState } from 'react'

import "./review.css"

export default function Review(){
    const [stars, setStars] = useState(0)
    const [isHidden, setHidden] = useState(false)

    return <div id="review" className= {isHidden ? "hidden" : ""}>
        <Close setHidden={()=>setHidden(true)}/>
        <label>Stars</label>
        <div id="stars">
            <Star starId={1} stars={stars} setStars={setStars}/>
            <Star starId={2} stars={stars} setStars={setStars}/>
            <Star starId={3} stars={stars} setStars={setStars}/>
            <Star starId={4} stars={stars} setStars={setStars}/>
            <Star starId={5} stars={stars} setStars={setStars}/>
        </div>
        <label>Description</label>
        <textarea/>
        <input type="submit" value="Submit"/>
    </div>
}

type StarProps = {
    starId: number, 
    stars: number, 
    setStars: (stars: number)=>void
}
function Star(props: StarProps){
    return (
        <span 
            onClick={
                ()=>props.setStars(props.starId)
            } 
            id={
                "star"+props.starId
            }
        >
            {(props.starId <= props.stars)? "★" : "☆"}
        </span>
    )
}

type closeProps = {
    setHidden: ()=>void
}
function Close(props: closeProps){
    return (
        <div className="close" onClick={props.setHidden}>x</div>
    )
}