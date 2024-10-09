import { useState } from "react";
import Popover from "../Popover/Popover";
import "./TextBlock.css";
import { CustomMap } from "../../models/dto";

interface Props {
    text: string,
    onClick?: () => void
    highlight?: boolean
    lexiInfo?: CustomMap<string>
}

const TextBlock = (props: Props) => {

    const [showPopover, setShowPopover] = useState(false)

    const closePopover = () => {
        setShowPopover(false)
    }

    const openPopover = () => {
        if (props.lexiInfo) {
            setShowPopover(true);
        }
    }

    return (
        <span className={ props.highlight ? "text-block--highlight" : "text-block" } onMouseEnter={ openPopover } onMouseLeave={ closePopover } >
            <Popover show={ showPopover } lexiInfo={ props.lexiInfo }/>
            <span>{ props.text }</span>
        </span>
    );
}

export default TextBlock;