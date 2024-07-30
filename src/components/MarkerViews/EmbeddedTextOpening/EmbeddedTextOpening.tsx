import { ReactElement } from "react";
import { VerseSegment } from "../../../models/dto";
import "./EmbeddedTextOpening.css";

interface Props {
    verseSegments: Array<VerseSegment>
}

const EmbeddedTextOpening = (props: Props) => {

    const content: Array<ReactElement> = [];
    props.verseSegments.forEach((vs, index) => {
        if (vs.verseNum) {
            content.push(<label className="mc-vr-n">{ vs.verseNum }</label>);
        }
        content.push(<span className="mc-vr-t">{ vs.text }</span>)
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