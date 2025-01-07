import { useState, useReducer } from 'react'
import "./admin_table.css"

type Header<T> = keyof T & string

type Action<T> = {
    [key: string]: (oldT: T, newT:T)=>void
}

type TableProps<T> = {
    headers: Header<T>[], 
    objs: T[], 
    actions: Action<T>
}
export default function AdminTable<T extends object>(props: TableProps<T>){
    return <table>
        <thead>
        <tr>
            {
                props.headers.map((h, i)=><th key={i}>{h}</th>)
            }
            <th key={props.headers.length} colSpan={Object.keys(props.actions).length}>Actions</th>
        </tr>
        </thead>
        <tbody>
        {
            props.objs.map((o, i)=> 
                <Row key={i} headers={props.headers} actions={props.actions} obj={o}/>
            )
        }
        </tbody>
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
        props.headers.map((h, i)=>
            <Entry
                key={i}
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
        )
    }
    {
        Object.entries(props.actions).map(([name, a], i)=>
            <th key={props.headers.length+i}><input type="button" value={name} onClick={()=>a(props.obj, currT)}/></th>
        )
    }
    </tr>
}


type EntryProp = {
    initText: string,
    currText: string,
    setText: (arg0: string)=>void
}
function Entry(props: EntryProp){
    return <th>
        <span className="entry">
            <input value="↻" onClick={()=>props.setText(props.initText)} disabled={props.currText==props.initText}/>
            <input 
                type="text" 
                value={props.currText} 
                onChange={e=>{props.setText(e.target.value); console.log(e.target.value)}}
            />
        </span>
    </th>
}