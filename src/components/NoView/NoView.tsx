import "./NoView.css"

interface Props {
    message: string
}

const NoView = (props: Props) => {

    return (
        <div className="no-view">
            { props.message }
        </div>
    );
}

export default NoView