import { CrossRefView, TextSegmentView } from "./dto"

export interface CrossRefAction {
    text: string
    onClick: () => void
}

export interface TextSegmentAction {
    textSegmentView: TextSegmentView,
    onClick: () => void
}