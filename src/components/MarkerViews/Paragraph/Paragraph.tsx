import { ReactElement } from "react";
import { VerseSegment } from "../../../models/dto";
import "./Paragraph.css";
import { MarkerUtil } from "../../../utils/MarkerUtils";

interface Props {
    verseSegments: Array<VerseSegment>
}

const Paragraph = (props: Props) => {

    const content: Array<ReactElement> = [];

    const buildWithTextBlocks = (vs: VerseSegment) : ReactElement => {

        const blocks = MarkerUtil.constructTextBlocks(vs);
        return <span className="mc-vr-t">{ blocks }</span>;
    }

    const buildWithoutTextBlocks = (vs: VerseSegment) : ReactElement => {
        return <span className="mc-vr-t">{ vs.text }</span>;
    }

    props.verseSegments.forEach((vs) => {
        if (vs.verseNum) {
            const c = <label className="mc-vr-n">{ vs.verseNum }</label>;
            content.push(c);
        }
        const c = vs.textSegmentActions && vs.textSegmentActions.length > 0 ? buildWithoutTextBlocks(vs) : buildWithoutTextBlocks(vs) ;
        content.push(c);
    });


    return (
        <div className="container-fluid marker-p mc-ta-l">
            { content }
        </div>
    );
}

export default Paragraph;