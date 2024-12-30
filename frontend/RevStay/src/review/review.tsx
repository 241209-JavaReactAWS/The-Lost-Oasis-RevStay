import { useState } from 'react'
import Star  from './star/star.tsx'

export function Review(){
    const [stars, setStars] = useState(0)

    return <div>
        <form>
            <label>Stars:</label>
            <div>
                <Star starId={1} stars={stars} setStars={setStars}/>
                <Star starId={2} stars={stars} setStars={setStars}/>
                <Star starId={3} stars={stars} setStars={setStars}/>
                <Star starId={4} stars={stars} setStars={setStars}/>
                <Star starId={5} stars={stars} setStars={setStars}/>
            </div>
            <label>Description:</label><br/>
            <input type="text" name="description"/><br/>
            <input type="submit" value="Submit"/><br/>
        </form>
    </div>
}