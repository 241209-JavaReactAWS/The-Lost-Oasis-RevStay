import { CSSProperties, useState } from 'react'
import "./admin_table.css"


type ToText<T> = (t: T)=>string
type ParseText<T> = (t: T, arg: string)=>(T|null)
type Header<T> = {
    [key: string]: [ToText<T>, ParseText<T>|null]
}

type Action<T> = {
    [key: string]: (anyChanges: boolean, newT:T)=>void
}

type TableProps<T> = {
    headers: Header<T>, 
    objs: T[], 
    actions: Action<T>,
    getKey: (t: T)=>number
}
export default function AdminTable<T extends object>(props: TableProps<T>){
    if (props.objs.length === 0){
        return <></>
    }

    return <table className="adminTable">
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
                    key={props.getKey(o)} 
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
    const [texts, setTexts] = useState<(string|null)[]>(
        new Array(Object.entries(props.headers).length).fill(null)
    )

    function updateCells(): T{
        return Object
            .values(
                props.headers
            )
            .reduce(
                (acc, [toText, parseText], i)=> {
                    const entry = texts[i]
                    //Skip this cell as there are no update to this cell
                    if (entry === null){
                        return acc
                    }

                    const newT = parseText!(acc, entry)
                    if (newT === null){
                        return acc
                    }

                    //Update the cell to if it successfully parsed
                    setTexts(
                        [...texts.slice(0, i), null, ...texts.slice(i+1)]
                    )

                    return newT
                },
                props.initObj
            )
    }
    
    return <tr>
    {
        Object.values(props.headers)
            .map(([toText, parseText], i)=>
                <Entry
                    key={i}
                    currText={
                        texts[i] ?? toText(props.initObj)
                    }
                    canEdit={
                        parseText !== null && Object.entries(props.actions).length != 0
                    }
                    setText={
                        (newText)=>{
                            let newEntry: null|string = newText
                            if (newEntry === toText(props.initObj)){
                                newEntry = null
                            }

                            setTexts(
                                [...texts.slice(0, i), newEntry, ...texts.slice(i+1)]
                            )
                        }
                    }
                    reset={()=>
                        setTexts(
                            [...texts.slice(0, i), null, ...texts.slice(i+1)]
                        )
                    }
                    canReset={
                        texts[i] !== null && texts[i] !== toText(props.initObj)
                    }
                />
            )
    }
    {
        Object.entries(props.actions)
            .map(([name, action], i)=>
                <td 
                    key={
                        Object.entries(props.headers).length+i
                    }
                    children = {
                        <button
                            onClick={()=>{
                                const shouldContinue = Object.values(props.headers).every(([toText, parseText], i)=>{
                                    //if a cell has something written, but cannot be parsed, then it should not continue
                                    if (texts[i] !== null && parseText!(props.initObj, texts[i]) === null){
                                        return false
                                    }
                                    return true
                                })
                                if (!shouldContinue){
                                    //Any visual indication of errors should be done inside parseText instead of here
                                    return
                                }

                                const newObj = updateCells()

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
        {
            <input
                type='button'
                onClick={props.reset}
                disabled={!props.canReset}
                style={{ padding: "0px", width: "20px"}}
                value={"↺"}
            />
        }
        <TextBox 
            currText = {props.currText}
            onChange = {props.setText}
        />
    </td>
}


interface TextProp{
    currText: string,
    onChange: (_: string)=>void
}
function TextBox(props: TextProp){
    const outerSpanStyle: CSSProperties = {
        display: "inline-block",
        position: "relative",
        minWidth: "2em", 
        minHeight: ".9em"
    }

    const innerSpanStyle: CSSProperties = {
        whiteSpace: "pre"
    }

    const inputStyle: CSSProperties = {
        padding: 0,
        margin: 0,
        border: "1px solid black",
        fontFamily: "inherit",
        fontSize: "inherit",
        position: "absolute",
        verticalAlign: "top",
        top: 0,
        left: 0,
        width: "100%",
        background: "white"
    }

    return (
        <span style={outerSpanStyle}>
            <span style={innerSpanStyle}>{props.currText}</span>
            <input
                style={inputStyle}
                type="text"
                value={props.currText}
                onChange={(event) =>props.onChange(event.target.value)}
            />
        </span>
    )
}
