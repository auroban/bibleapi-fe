import { ReactElement } from "react";
import { VerseSegment } from "../../../models/dto";
import "./CenteredParagraph.css";
import { MarkerUtil } from "../../../utils/MarkerUtils";

interface Props {
    verseSegment: VerseSegment
}

const CenteredParagraph = (props: Props) => {

    const buildWithTextBlocks = (vs: VerseSegment) : ReactElement => {

        const blocks = MarkerUtil.constructTextBlocks(vs);
        return <span className="mc-vr-t">{ blocks }</span>;
    }

    const buildWithoutTextBlocks = (vs: VerseSegment) : ReactElement => {
        return <span className="mc-vr-t">{ vs.text }</span>;
    }

    const content: Array<ReactElement> = []
    if (props.verseSegment.verseNum) {
        const c = <label className="mc-vr-n">{ props.verseSegment.verseNum }</label>;
        content.push(c);
    }
    const c = props.verseSegment.textSegmentActions.length > 0 ? buildWithTextBlocks(props.verseSegment) : buildWithoutTextBlocks(props.verseSegment);
    content.push(c);

    return (
        <div className="container-fluid marker-pc">
            { content }
        </div>
    );
}

export default CenteredParagraph;