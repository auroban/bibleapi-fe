import { ReactElement } from "react";
import { Marker } from "../../../constants/Marker";
import { CustomMap, VerseSegment } from "../../../models/dto";
import "./ListEntry.css";
import { MarkerUtil } from "../../../utils/MarkerUtils";

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

    const buildWithTextBlocks = (vs: VerseSegment) : ReactElement => {

        const blocks = MarkerUtil.constructTextBlocks(vs);
        return <span className="mc-vr-t">{ blocks }</span>;
    }

    const buildWithoutTextBlocks = (vs: VerseSegment) : ReactElement => {
        return <span className="mc-vr-t">{ vs.text }</span>;
    }

    const content = props.verseSegment.textSegmentActions.length > 0 ? buildWithTextBlocks(props.verseSegment) : buildWithoutTextBlocks(props.verseSegment);
    
    return (
        <div className={`container-fluid ${cssClass} mc-ta-l`}>
            { props.verseSegment.verseNum ? <label className="mc-vr-n">{ props.verseSegment.verseNum }</label> : null }       
            { content }
        </div>
    );
}

export default ListEntry;