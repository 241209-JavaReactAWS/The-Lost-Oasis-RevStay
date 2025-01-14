interface HiderProps{
    name: string,
    children: any,
}
export default function Hider(props: HiderProps){
    return (
        <details>
            <summary>{props.name}</summary>
            {props.children}
        </details>
    )
}