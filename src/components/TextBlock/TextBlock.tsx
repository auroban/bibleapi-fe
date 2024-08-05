import { ReactElement, useState } from "react";
import "./TextBlock.css";

interface Props {
    text: string,
    onClick?: () => void
    highlight?: boolean
}

const TextBlock = (props: Props) => {

    return (
        <span className={ props.highlight ? "text-block--highlight" : "text-block" } onClick={ () => props.onClick ? props.onClick() : null }>
                { props.text }
        </span>
    );
}

export default TextBlock;