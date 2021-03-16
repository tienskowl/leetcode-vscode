import { config } from '../config'
import * as apiCn from './api.cn'
import * as apiEn from './api'
import { getDb } from '../db';
import { ConciseQuestion, Problems } from '../model/common'
import { cache, ALLQUESTIONS } from '../cache';
import * as modelCn from '../model/question.cn'
import * as modelEn from '../model/question'

export const api = {
    async fetchQuestionDetailById(id: string | number) {
        if (typeof id === 'string') {
            id = parseInt(id)
        }
        const db = await getDb()
        const out = await db.read(id)
        if (out) { return JSON.parse(out) }
    },
    async fetchQuestionDetail(titleSlug: string) {
        if (config.lang === 'en') {
            return apiEn.api.fetchQuestionDetail(titleSlug)
        } else {
            return apiCn.api.fetchQuestionDetail(titleSlug)

        }
    },
    async fetchContestQuestionDetail(titleSlug: string, weekname: string) {
        if (config.lang === 'en') {
            return apiEn.api.fetchContestQuestionDetail(titleSlug, weekname)
        } else {
            return apiCn.api.fetchContestQuestionDetail(titleSlug, weekname)

        }
    },
    async fetchQuestionByItemId(id: string) {
        if (config.lang === 'en') {
            const res = await apiEn.api.fetchChapterItem(id)
            return res.item.question
        }
    },
    async saveQuestionDetail(question) {
        const db = await getDb()
        await db.add(JSON.stringify(question), Number(question.questionId), Number(question.questionFrontendId))
    },
    async submitContest(options: modelCn.SubmitContestOptions | modelEn.SubmitContestOptions) {
        if (config.lang === 'en') {
            return apiEn.api.submitContest(options)
        } else {
            return apiCn.api.submitContest(options)
        }
    },
    async submit(options: modelCn.SubmitOptions | modelEn.SubmitOptions) {
        if (config.lang === 'en') {
            return apiEn.api.submit(options)
        } else {
            return apiCn.api.submit(options)
        }
    },

    async check(options: modelCn.CheckOptions | modelEn.CheckOptions) {
        if (config.lang === 'en') {
            return apiEn.api.check(options)
        } else {
            return apiCn.api.check(options)
        }
    },
    checkContest(options: modelCn.CheckContestOptions | modelEn.CheckContestOptions) {
        if (config.lang === 'en') {
            return apiEn.api.checkContest(options)
        } else {
            return apiCn.api.checkContest(options)
        }
    },
    async getAllQuestions() {
        if (config.lang === 'en') {
            return apiEn.api.getAllQuestions()
        } else {
            return apiCn.api.getAllQuestions();
        }
    }

}

export async function freshQuestions() {
    if (config.lang === 'en') {
        await apiEn.api.freshQuestions()
    } else {
        await apiCn.api.freshQuestions();
    }
}

function handleCategorieQuestions(data) {
    const { stat_status_pairs } = data;
    const questions = stat_status_pairs.map(v => ({
        fid: String(v.stat.frontend_question_id),
        level: v.difficulty.level,
        id: v.stat.question_id,
        title: v.stat.question__title,
        slug: v.stat.question__title_slug,
        acs: v.stat.total_acs,
        submitted: v.stat.total_submitted,
        paid_only: v.paid_only,
        status: v.status,
        name: v.stat.question__title
    }));
    return questions;
}
export { apiEn, apiCn }