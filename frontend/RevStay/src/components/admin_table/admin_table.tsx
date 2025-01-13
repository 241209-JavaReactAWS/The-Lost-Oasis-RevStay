import { useState } from 'react'
import "./admin_table.css"


type Getter<T> = (t: T)=>string

type Setter<T> = (t: T, arg: string)=>(T|null)

type Header<T> = {
    [key: string]: [Getter<T>, Setter<T>|null]
}

type Action<T> = {
    [key: string]: (anyChanges: boolean, newT:T)=>void
}

type TableProps<T> = {
    headers: Header<T>, 
    objs: T[], 
    actions: Action<T>
}
export default function AdminTable<T extends object>(props: TableProps<T>){
    if (props.objs.length === 0){
        return <></>
    }

    return <table>
        <thead>
        <tr>
            {
                Object.entries(props.headers)
                    .map(([k, v], i)=>
                        <th 
                            key={i}
                            children={k}
                        />
                    )
            }
            {
                Object.entries(props.actions).length === 0
                ?
                <></>
                :
                <th 
                    key={Object.entries(props.headers).length} 
                    colSpan={Object.keys(props.actions).length}
                    children="Actions"
                />
            }
        </tr>
        </thead>
        <tbody>{
            props.objs.map((o, i)=> 
                <Row 
                    key={i} 
                    headers={props.headers} 
                    actions={props.actions} 
                    initObj={o}
                />
            )
        }</tbody>
    </table>
}

type RowProp<T> = {
    headers: Header<T>, 
    actions: Action<T>, 
    initObj: T
}
function Row<T>(props: RowProp<T>){
    const initEntries = Object
        .values(props.headers)
        .map(([getter, setter], _, __)=>{
            return getter(props.initObj)
        })
    
    const [currEntries, setEntryText] = useState(initEntries)

    function createObj(){
        return Object
            .values(
                props.headers
            )
            .reduce(
                (acc, [getter, setter], i)=> {
                    if (setter === null){
                        return acc
                    }
                    const newT = setter(acc, currEntries[i])

                    if (newT === null){
                        return acc
                    }

                    return newT
                },
                props.initObj
            )
    }
    
    return <tr>
    {
        Object.entries(props.headers)
            .map(([name, [getter, setter]], i)=>
                <Entry
                    key={i}
                    currText={
                        currEntries[i]
                    }
                    canEdit={
                        setter !== null
                    }
                    setText={
                        (newText)=>setEntryText(
                            [...currEntries.slice(0, i), newText, ...currEntries.slice(i+1)]
                        )
                    }
                    reset={()=>
                        setEntryText(
                            [...currEntries.slice(0, i), initEntries[i], ...currEntries.slice(i+1)]
                        )
                    }
                    canReset={
                        currEntries[i] !== getter(props.initObj)
                    }
                />
            )
    }
    {
        Object.entries(props.actions)
            .map(([name, action], i)=>
                <th 
                    key={
                        Object.entries(props.headers).length+i
                    }
                    children = {
                        <button
                            onClick={()=>{
                                const newObj = createObj()

                                const anyChange = JSON.stringify(newObj) !== JSON.stringify(props.initObj)

                                action(anyChange, newObj)
                            }}
                            children={name}
                        />
                    }
                />
            )
    }
    </tr>
}


type EntryProp = {
    currText: string,
    canEdit: boolean,
    setText: (arg0: string)=>void
    canReset: boolean,
    reset: ()=>void,
}
function Entry(props: EntryProp){
    if (!props.canEdit){
        return <td>
            {props.currText}
        </td>
    }

    return <td>
        <button
            onClick={
                ()=>props.reset()
            } 
            disabled={
                !props.canReset
            }
            children="↺"
        />
        <input
            type='text'
            value={
                props.currText
            } 
            onChange={e=>
                props.setText!(e.target.value)
            }
        />
    </td>
}