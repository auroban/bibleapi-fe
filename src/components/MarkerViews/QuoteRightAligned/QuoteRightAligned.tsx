import { ReactElement } from "react";
import { VerseSegment } from "../../../models/dto";
import "./QuoteRightAligned.css";

interface Props {
    verseSegment: VerseSegment
}

const QuoteRightAligned = (props: Props) => {

    return (
        <div className="container-fluid marker-qr">
            <span className="mc-vr-t">{ props.verseSegment.text }</span>
        </div>
    );
}

export default QuoteRightAligned;