import { useState } from 'react'

export function Entry({initText}: {initText: string}){
    const [currText, setText] = useState(initText)

    return <>
        <button onClick={()=>setText(initText)} disabled={currText==initText}>↻</button>
        <input 
            type="text" 
            value={currText} 
            onChange={e=>setText(e.target.value)}
        />
    </>
}