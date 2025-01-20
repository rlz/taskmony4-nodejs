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

export interface ChecklistItem {
    readonly name: string
    readonly checked: boolean
}

export interface Checklist {
    readonly id: string
    readonly lastModified: DateTime<true>
    readonly title: string
    readonly items: readonly ChecklistItem[]
    readonly deleted: boolean
}
