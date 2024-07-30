import { Marker } from "../../../constants/Marker";
import { CustomMap, VerseSegment } from "../../../models/dto";
import "./ListEntry.css";

interface Props {
    syntax: string
    verseSegment: VerseSegment
}

const ListEntry = (props: Props) => {

    const cssMap: CustomMap<string> = {};
    cssMap[Marker.LIST_ENTRY] = "marker-li";
    cssMap[Marker.LIST_ENTRY_1] = "marker-li";
    cssMap[Marker.LIST_ENTRY_2] = "marker-li--1";
    cssMap[Marker.LIST_ENTRY_3] = "marker-li--2";

    const cssClass = cssMap[props.syntax] ?? cssMap[Marker.LIST_ENTRY];
    return (
        <div className={`container-fluid ${cssClass} mc-ta-l`}>
            { props.verseSegment.verseNum ? <label className="mc-vr-n">{ props.verseSegment.verseNum }</label> : null }       
            <label className="mc-vr-t">{ props.verseSegment.text }</label>
        </div>
    );
}

export default ListEntry;