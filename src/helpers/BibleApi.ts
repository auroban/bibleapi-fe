import { request } from "http";
import { ResourceURL } from "../constants/ResourceURL";
import { ChapterDetailedView, ChapterOverview, TranslationOverview, VerseDetailedView } from "../models/dto";
import { ChapterDetailedViewRequest, ChapterOverviewRequest, TranslationOverviewRequest, VerseDetailedViewRequest } from "../models/request";
import { ApiResponse, ChapterDetailedViewResponse, ChapterOverviewResponse, TranslationOverviewResponse, VerseDetailedViewResponse } from "../models/response";
import { toChapterDetailedView, toChapterOverview, toTranslationOverview, toVerseDetailedView } from "../utils/MapperUtils";

class BibleApi {

    private static _instance: BibleApi | null = null

    private constructor() {

    }

    public static getInstance() : BibleApi {
        if (BibleApi._instance == null) {
            BibleApi._instance = new BibleApi();
        }
        return BibleApi._instance;
    }

    public async getAllTranslationOverviews() : Promise<Array<TranslationOverview>> {
        console.debug("Fetching all translation overviews");
        const response = await fetch(ResourceURL.TRANSLATION_OVERVIEW);
        if (!response.ok) {
            throw new Error("Failed to fetch all translation overviews");
        }
        const apiResponse: ApiResponse<Array<TranslationOverviewResponse>> = await response.json();
        const translationOverviews: Array<TranslationOverview> = [];
        apiResponse.data?.forEach((item) => {
            const t = toTranslationOverview(item);
            translationOverviews.push(t);
        });
        return translationOverviews;
    }

    public async getTranslationOverview(request: TranslationOverviewRequest) : Promise<TranslationOverview> {
        console.debug(`Fetching translation overview for code: ${request.translationCode}`);
        const url = `${ResourceURL.TRANSLATION_OVERVIEW}/${request.translationCode}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch translation overview by code: ${request.translationCode}`);
        }
        const apiResponse: ApiResponse<TranslationOverviewResponse> = await response.json();
        return toTranslationOverview(apiResponse.data!!);
    }

    public async getChapterOverview(request: ChapterOverviewRequest) : Promise<ChapterOverview> {
        console.debug(`Fetching chapter overview by request: ${JSON.stringify(request)}`);
        const url = `${ResourceURL.TRANSLATION_OVERVIEW}/${request.translationCode}/${request.bookCode}/${request.chapterNum}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch chapter overview by request: ${JSON.stringify(request)}`);
        }
        const apiResponse: ApiResponse<ChapterOverviewResponse> = await response.json();
        return toChapterOverview(apiResponse.data!!);
    }

    public async getChapterDetailedView(request: ChapterDetailedViewRequest) : Promise<ChapterDetailedView> {
        console.debug(`Fetching chapter detailed view by request: ${JSON.stringify(request)}`);
        const url = `${ResourceURL.BASE_URL}/${request.translationCode}/${request.bookCode}/${request.chapterNum}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch chapter detailed view by request: ${JSON.stringify(request)}`);
        }
        const apiResponse: ApiResponse<ChapterDetailedViewResponse> = await response.json();
        return toChapterDetailedView(apiResponse.data!!);

    }

    public async getVerseDetailedView(request: VerseDetailedViewRequest) : Promise<VerseDetailedView> {
        console.debug(`Fetching verse detailed view by request: ${JSON.stringify(request)}`);
        const url = `${ResourceURL.BASE_URL}/${request.translationCode}/${request.bookCode}/${request.chapterNum}/${request.verseNum}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch verse detailed view by request: ${JSON.stringify(request)}`);
        }
        const apiResponse: ApiResponse<VerseDetailedViewResponse> = await response.json();
        return toVerseDetailedView(apiResponse.data!!);
    }

}

export default BibleApi;