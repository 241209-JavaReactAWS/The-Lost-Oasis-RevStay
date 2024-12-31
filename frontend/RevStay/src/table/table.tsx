import { useState, useReducer } from 'react'
import "./entry.css"

type Header<T> = keyof T & string

type Action<T> = {
    [key: string]: (oldT: T, newT:T)=>void
}

type TableProps<T> = {
    headers: Header<T>[], 
    objs: T[], 
    actions: Action<T>
}
export default function Table<T extends object>(props: TableProps<T>){
    return <table>
        <tr>
            {
                props.headers.map(h=><th>{h}</th>)
            }
            <th colSpan={Object.keys(props.actions).length}>Actions</th>
        </tr>
        {
            props.objs.map(o=> 
                <Row headers={props.headers} actions={props.actions} obj={o}/>
            )
        }
    </table>
}

type RowProp<T> = {
    headers: Header<T>[], 
    actions: Action<T>, 
    obj: T
}
function Row<T>(props: RowProp<T>){
    const [currT, _] = useState({...props.obj})
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    
    return <tr>
    {
        props.headers.map((h)=>
            <th>
                <Entry<T> 
                    initText={
                        props.obj[h] as string
                    }
                    currText={
                        currT[h] as string
                    }
                    setText={
                        t=>{currT[h] = t as any;  forceUpdate();}
                    }
                />
            </th>
        )
    }
    {
        Object.entries(props.actions).map(([name, a], _)=>
            <th><input type="button" value={name} onClick={()=>a(props.obj, currT)}/></th>
        )
    }
    </tr>
}


type EntryProp<T> = {
    initText: string,
    currText: string,
    setText: (arg0: string)=>void
}
function Entry<T>(props: EntryProp<T>){
    return <span className="entry">
        <input value="↻" onClick={()=>props.setText(props.initText)} disabled={props.currText==props.initText}/>
        <input 
            type="text" 
            value={props.currText} 
            onChange={e=>{props.setText(e.target.value); console.log(e.target.value)}}
        />
    </span>
}