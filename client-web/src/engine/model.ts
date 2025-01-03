import { DateTime } from 'luxon'

interface TaskCommon {
    readonly id: string
    readonly lastModified: DateTime<true>
    readonly category: string
    readonly title: string
    readonly date: DateTime<true>
}

export interface FinishedTask extends TaskCommon {
    readonly finished: DateTime<true>
}

export interface ActiveTask extends TaskCommon {
    readonly finished: null
}

export type Task = FinishedTask | ActiveTask
