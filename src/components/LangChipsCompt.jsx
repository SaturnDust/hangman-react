export default function LangChipsCompt(props){
    
    const style = {
        backgroundColor : props.backgroundColor,
        color : props.color
    }

    return(
        <>
            <button className="language-chips" style={style}>{props.name}</button>
        </>
    );
}