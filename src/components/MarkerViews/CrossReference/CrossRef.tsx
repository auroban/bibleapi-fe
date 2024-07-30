import { ReactElement } from "react";
import { CrossRefAction } from "../../../models/actions";
import "./CrossRef.css";

interface Props {
    actions: Array<CrossRefAction>
}

const CrossRef = (props: Props) => {

    const crossRefs = props.actions.map((item) => {
        return <label className="marker-r--label-color marker-r--label-bh" onClick={ item.onClick }>{ item.text }</label>
    });

    const content: Array<ReactElement> = [];
    crossRefs.forEach((cf, index) => {
        content.push(cf);
        if (index < crossRefs.length - 1) {
            content.push(<span className="mc-space">;</span>);
        }
    })

    return (
        <div className="container-fluid mc-ta-l">
            <label className="marker-r--label-color">
                <span className="mc-space">{"("}</span>
                { content }
                <span className="mc-space" />
                <span>{")"}</span>
            </label>
        </div>
    );
}

export default CrossRef;