import { ReactElement } from "react";
import { CustomMap, TextSegmentView, VerseSegment } from "../../../models/dto";
import "./Paragraph.css";
import TextBlock from "../../TextBlock/TextBlock";

interface Props {
    verseSegments: Array<VerseSegment>
}

const Paragraph = (props: Props) => {

    const content: Array<ReactElement> = [];
    props.verseSegments.forEach((vs) => {
        if (vs.verseNum) {
            const c = <label className="mc-vr-n">{ vs.verseNum }</label>;
            content.push(c);
        }
        const c = <span className="mc-vr-t">{ vs.text }</span>;
        content.push(c);
    });


    return (
        <div className="container-fluid marker-p mc-ta-l">
            { content }
        </div>
    );
}

export default Paragraph;