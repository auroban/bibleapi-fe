import { ReactElement } from "react";
import { VerseSegment } from "../../../models/dto";
import "./HebrewNote.css";

interface Props {
    verseSegment: VerseSegment
}

const HebrewNote = (props: Props) => {

    const content: Array<ReactElement> = [];
    if (props.verseSegment.verseNum) {
        const c = <label className="mc-vr-n">{ props.verseSegment.verseNum }</label>;
        content.push(c);
    }
    const c = <span className="mc-vr-t">{ props.verseSegment.text }</span>;
    content.push(c);

    return (
        <div className="container-fluid marker-qd">
            { content }
        </div>
    );
};

export default HebrewNote;