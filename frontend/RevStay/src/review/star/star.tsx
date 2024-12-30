export default function Star({starId, stars, setStars}: {starId: number, stars: number, setStars: (stars: number)=>void}){
    return <span onClick={()=>setStars(starId)} id={"star"+starId}>
        {starId <= stars? "★" :"☆"}
    </span>
}