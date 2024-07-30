import "./Heading.css";

interface Props {
    text: string
}

const Heading = (props: Props) => {

    return (
        <div className="container-fluid marker-s mc-ta-l">
            <label>{ props.text }</label>
        </div>
    );
}

export default Heading;