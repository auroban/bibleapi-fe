import { ReactElement } from "react";
import { VerseSegment } from "../../../models/dto";
import "./QuoteRightAligned.css";
import { MarkerUtil } from "../../../utils/MarkerUtils";

interface Props {
    verseSegment: VerseSegment
}

const QuoteRightAligned = (props: Props) => {

    const buildWithTextBlocks = (vs: VerseSegment) : ReactElement => {

        const blocks = MarkerUtil.constructTextBlocks(vs);
        return <span className="mc-vr-t">{ blocks }</span>;
    }

    const buildWithoutTextBlocks = (vs: VerseSegment) : ReactElement => {
        return <span className="mc-vr-t">{ vs.text }</span>;
    }

    const content = props.verseSegment.textSegmentActions.length > 0 ? buildWithTextBlocks(props.verseSegment) : buildWithoutTextBlocks(props.verseSegment);

    return (
        <div className="container-fluid marker-qr">
            { content }
        </div>
    );
}

export default QuoteRightAligned;