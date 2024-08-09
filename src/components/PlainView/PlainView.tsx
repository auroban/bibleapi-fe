import { ReactElement } from "react";
import { ChapterDetailedView } from "../../models/dto";
import "./PlainView.css";

interface Props {
    chapter: ChapterDetailedView
}

const PlainView = (props: Props) => {

    const content: Array<ReactElement> = [];

    if (props.chapter.verses) {
        Object.keys((props.chapter.verses)).forEach((key) => {
            const vv = props.chapter.verses!![key];
            const c = (
                <div className="container-fluid plain-view--vr">
                    <label className="mc-vr-n">{ key }</label>
                    <span className="mc-vr-t">{ vv.text }</span>
                </div>
            );
            content.push(c);
        });
    }



    return (
        <div className="container-fluid plain-view">
            { content }
        </div>
    );
}

export default PlainView;