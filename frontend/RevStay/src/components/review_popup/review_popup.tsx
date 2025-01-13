import { useState } from 'react'
import "./review.css"
import { postman } from '../../postman'


interface ReviewProps{
    hotelId: number
}

export default function ReviewPopup(props: ReviewProps){
    const [rating, setRating] = useState(0)
    const [suggestedRating, setSuggestedRating] = useState(0)
    const [isHidden, setHidden] = useState(false)
    const [text, setText] = useState("")

    return <div className = {"review_popup" + (isHidden ? " hidden" : "")} >
        <Close setHidden={()=>setHidden(true)}/>
        <label>Stars</label>
        <div id="stars">
        {
            [1,2,3,4,5].map(i=>
                <Star 
                    key={i}
                    shouldDisplay={
                        (suggestedRating == 0) ? i <= rating : i <= suggestedRating
                    }
                    onClick={
                        ()=>setRating(i)
                    }
                    onMouseIn={
                        ()=>setSuggestedRating(i)
                    }
                    onMouseOut={
                        ()=>setSuggestedRating(0)
                    }
                />
            )
        }
        </div>
        <label>Description</label>
        <textarea onChange={e=>setText(e.target.value)}/>
        <input 
            type="submit" 
            value="Submit" 
            onClick={e=>{
                submit(props.hotelId, rating, text)
                setHidden(true)
            }}
        />
    </div>
}

function submit(hotelId: number, rating: number, description: string){
    if (rating == 0){
        alert("Please select a rating")
        return
    }

    const body = {
        hotelId: hotelId,
        rating: rating,
        comment: description
    }

    console.log(body)

    postman.post(
        "/reviews", 
        body
    )
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