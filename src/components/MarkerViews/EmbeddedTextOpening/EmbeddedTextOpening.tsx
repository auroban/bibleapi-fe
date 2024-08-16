import { ReactElement } from "react";
import { VerseSegment } from "../../../models/dto";
import "./EmbeddedTextOpening.css";
import { MarkerUtil } from "../../../utils/MarkerUtils";

interface Props {
    verseSegments: Array<VerseSegment>
}

const EmbeddedTextOpening = (props: Props) => {

    const content: Array<ReactElement> = [];

    const buildWithTextBlocks = (vs: VerseSegment) : ReactElement => {

        const blocks = MarkerUtil.constructTextBlocks(vs);
        return <span className="mc-vr-t">{ blocks }</span>;
    }

    const buildWithoutTextBlocks = (vs: VerseSegment) : ReactElement => {
        return <span className="mc-vr-t">{ vs.text }</span>;
    }
    
    props.verseSegments.forEach((vs, index) => {
        console.debug(`Current Verse Segment: ${JSON.stringify(vs)}`);
        if (vs.verseNum) {
            content.push(<label className="mc-vr-n">{ vs.verseNum }</label>);
        }
        content.push(buildWithoutTextBlocks(vs));

        if (vs.textSegmentActions.length > 0) {
            content.push(buildWithTextBlocks(vs));
        } else {
            content.push(buildWithoutTextBlocks(vs));
        }
        if (index < props.verseSegments.length - 1) {
            content.push(<span className="mc-space" />);
        }
    });

    return (
        <div className="container marker-pmo mc-ta-l">
           { content }
        </div>
    );
}

export default EmbeddedTextOpening;