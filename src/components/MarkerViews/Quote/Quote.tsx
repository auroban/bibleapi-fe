import { Marker } from "../../../constants/Marker";
import { CustomMap, VerseSegment } from "../../../models/dto";
import "./Quote.css";

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
    
    return (
        <div className={ `container ${cssClass} mc-ta-l` }>
            { props.verseSegment.verseNum ? <label className="mc-vr-n">{ props.verseSegment.verseNum }</label> : null }
            <span className="mc-vr-t">{ props.verseSegment.text }</span>
        </div>
    );

};

export default Quote;