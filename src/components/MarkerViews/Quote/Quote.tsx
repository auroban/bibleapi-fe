import { ReactElement } from "react";
import { Marker } from "../../../constants/Marker";
import { CustomMap, VerseSegment } from "../../../models/dto";
import "./Quote.css";
import { MarkerUtil } from "../../../utils/MarkerUtils";

interface Props {
    syntax: string
    verseSegment: VerseSegment
}

const Quote = (props: Props) => {

    const cssMap: CustomMap<string> = {};
    cssMap[Marker.QUOTE] = "marker-q";
    cssMap[Marker.QUOTE_1] = "marker-q";
    cssMap[Marker.QUOTE_2] = "marker-q--1";
    cssMap[Marker.QUOTE_3] = "marker-q--2";

    const cssClass = cssMap[props.syntax] ?? cssMap[Marker.QUOTE];

    const buildWithTextBlocks = (vs: VerseSegment) : ReactElement => {

        const blocks = MarkerUtil.constructTextBlocks(vs);
        return <span className="mc-vr-t">{ blocks }</span>;
    }

    const buildWithoutTextBlocks = (vs: VerseSegment) : ReactElement => {
        return <span className="mc-vr-t">{ vs.text }</span>;
    }

    const content = props.verseSegment.textSegmentActions.length > 0 ? buildWithTextBlocks(props.verseSegment) : buildWithoutTextBlocks(props.verseSegment);
    
    return (
        <div className={ `container ${cssClass} mc-ta-l` }>
            { props.verseSegment.verseNum ? <label className="mc-vr-n">{ props.verseSegment.verseNum }</label> : null }
            { content }
        </div>
    );

};

export default Quote;