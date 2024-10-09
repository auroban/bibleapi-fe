import { ReactElement, useState } from "react";
import { CustomMap } from "../../models/dto";
import "./Popover.css"

interface Props {
    lexiInfo?: CustomMap<string>
    show?: boolean
}

const Popover = (props: Props) => {

    const contentList: Array<ReactElement> = [];

    if (props.lexiInfo) {
        Object.keys(props.lexiInfo).forEach((k) => {
            const value = props.lexiInfo ? props.lexiInfo[k] : "";
            const kComponent = <div className="popover-content--key">{k}:</div>
            const vComponent = <div>{value}</div>
            const innerList: Array<ReactElement> = []
            innerList.push(kComponent);
            innerList.push(vComponent);
            const d = <div className="popover-content">{ innerList }</div>
            contentList.push(d);
        })
    }
  
    return (
      <span className="popover-container">
        {props.show && (
          <div className="popover">
              { contentList }
          </div>
        )}
      </span>
    );
  };
  
  export default Popover;