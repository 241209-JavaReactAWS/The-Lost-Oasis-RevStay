import { useState } from 'react'

import "./review.css"

export default function ReviewPopup(){
    const [stars, setStars] = useState(0)
    const [hoverStars, setHoverStars] = useState(0)
    
    const [isHidden, setHidden] = useState(false)

    return <div id="review" className= {isHidden ? "hidden" : ""}>
        <Close setHidden={()=>setHidden(true)}/>
        <label>Stars</label>
        <div id="stars">
        {
            [1,2,3,4,5].map(i=>
                <Star 
                    key={i}
                    shouldDisplay={
                        (hoverStars == 0) ? i <= stars : i <= hoverStars
                    }
                    onClick={
                        ()=>setStars(i)
                    }
                    onMouseIn={
                        ()=>setHoverStars(i)
                    }
                    onMouseOut={
                        ()=>setHoverStars(0)
                    }

                />
            )
        }
        </div>
        <label>Description</label>
        <textarea/>
        <input type="submit" value="Submit"/>
    </div>
}

type StarProps = {
    shouldDisplay: boolean, 
    onClick: ()=>void,
    onMouseIn: ()=>void,
    onMouseOut: ()=>void
}
function Star(props: StarProps){
    return (
        <span 
            className = "star"
            onClick={
                ()=>props.onClick()
            } 
            onMouseEnter={
                ()=>props.onMouseIn()
            }
            onMouseLeave={
                ()=>props.onMouseOut()
            }
        >
        {props.shouldDisplay ? "★" : "☆"}
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