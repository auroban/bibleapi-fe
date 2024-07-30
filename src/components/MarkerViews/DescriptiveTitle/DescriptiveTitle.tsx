import "./DescriptiveTitle.css";

interface Props {
    text: string
}

const DescriptiveTitle = (props: Props) => {

    return (
        <div className="container-fluid marker-d">
            <p>{ props.text }</p>
        </div>
    );
}

export default DescriptiveTitle;