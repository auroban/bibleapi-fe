import { ReactElement, useState } from "react";
import "./VerseBlock.css";

interface Props {
    num: string,
    textBlocks: Array<ReactElement>
}

interface State {

}

const VerseBlock = (props: Props) => {

    const initState: State = {};

    const [state, setState] = useState(initState);

    return (
        <div className="verse-block">
            <label className="verse-block__id bhv--ns">{ props.num }</label>
            <div className="verse-block__content">{ props.textBlocks }</div>
        </div>
    );
};

export default VerseBlock;

