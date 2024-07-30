const isNullOrEmtpty = (text: string | null | undefined) : boolean => {
    if (!text) {
        return true;
    }
    if (text.replaceAll(" ", "").length === 0) {
        return true;
    }
    return false;
}

const parseTextSegment = (text: string, startIndex: number, endIndex: number) : string => {
    if (TextUtils.isNullOrEmtpty(text)) {
        return "";
    }
    return text.substring(startIndex, endIndex + 1);
}

export const TextUtils = {
    isNullOrEmtpty : isNullOrEmtpty,
    parseTextSegment : parseTextSegment,
}