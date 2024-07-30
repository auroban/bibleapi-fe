import { ReactElement } from "react";
import "./LexiInfoModal.css";

interface Props {
    title: string
    dataMap: { [key: string] : string }
}

const LexiInfoModal = (props: Props) => {

    const content: Array<ReactElement> = [];

    Object.keys(props.dataMap).forEach((key) => {
        let c = <div><label style={{ fontWeight: "bold" }}>{ key }</label>:<span style={{ width: "10px"}} /><label>{props.dataMap[key]}</label></div>;
        content.push(c);
    })

    return (
        <div 
            className="lexi-info-modal modal fade" 
            tabIndex={ -1 }
            id="exampleModal"
            aria-labelledby="exampleModalLabel" 
            aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{ props.title }</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <p>Modal body text goes here.</p>
                    { content }
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>
    );
};

export default LexiInfoModal;