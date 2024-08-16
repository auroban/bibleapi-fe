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

    let currentVerseNum = -1;
    props.verseSegments.forEach((vs) => {
        if(currentVerseNum !== -1) {
            content.push(<span className="mc-space" />);
        }
        if (vs.verseNum) {
            const c = <label className="mc-vr-n">{ vs.verseNum }</label>;
            content.push(c);
            currentVerseNum = Number.parseInt(vs.verseNum);
        }
        const c = vs.textSegmentActions.length > 0 ? buildWithTextBlocks(vs) : buildWithoutTextBlocks(vs);
        content.push(c);
    });


    return (
        <div className="container-fluid marker-p mc-ta-l">
            { content }
        </div>
    );
}

export default Paragraph;