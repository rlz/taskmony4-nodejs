import { DateTime } from 'luxon'

import { Checklist, Task } from '../engine/model'

export interface IdbTaskV0 {
    readonly id: string
    readonly lastModified: number
    readonly category: string
    readonly title: string
    readonly date: string
    readonly finished: string | null
}

export function taskToIdb(task: Task): IdbTaskV0 {
    return {
        id: task.id,
        lastModified: task.lastModified.toMillis(),
        category: task.category,
        title: task.title,
        date: task.date.toISODate(),
        finished: task.finished?.toISODate() ?? null
    }
}

export function taskFromIdb(task: IdbTaskV0): Task {
    const lastModified = DateTime.fromMillis(task.lastModified, { zone: 'utc' })
    const date = DateTime.fromISO(task.date, { zone: 'utc' })
    const finished = task.finished === null ? null : DateTime.fromISO(task.finished, { zone: 'utc' })

    if (!lastModified.isValid || !date.isValid || (finished !== null && !finished.isValid)) {
        throw Error('Can not create DateTime')
    }

    return {
        id: task.id,
        lastModified,
        category: task.category,
        title: task.title,
        date,
        finished
    }
}

export interface IdbChecklistV0 {
    readonly id: string
    readonly lastModified: number
    readonly title: string
    readonly items: readonly { readonly name: string, readonly checked: boolean }[]
    readonly deleted?: boolean
}

export function checklistToIdb(checklist: Checklist): IdbChecklistV0 {
    return {
        id: checklist.id,
        lastModified: checklist.lastModified.toMillis(),
        title: checklist.title,
        items: checklist.items,
        deleted: checklist.deleted
    }
}

export function checklistFromIdb(checklist: IdbChecklistV0): Checklist {
    const lastModified = DateTime.fromMillis(checklist.lastModified, { zone: 'utc' })

    if (!lastModified.isValid) {
        throw Error('Can not create DateTime')
    }

    return {
        id: checklist.id,
        lastModified,
        title: checklist.title,
        items: checklist.items,
        deleted: checklist.deleted === true
    }
}
