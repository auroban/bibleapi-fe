import { ReactElement, useState } from "react";
import "./TextBlock.css";

interface Props {
    text: string,
    onClick?: () => void
}

const TextBlock = (props: Props) => {

    return (
        <span className="text-block" onClick={ () => props.onClick ? props.onClick() : null }>
                { props.text }
        </span>
    );
}

export default TextBlock;