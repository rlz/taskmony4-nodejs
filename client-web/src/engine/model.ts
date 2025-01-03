import { DateTime } from 'luxon'

export interface Task {
    readonly id: string
    readonly lastModified: DateTime<true>
    readonly category: string
    readonly title: string
    readonly date: DateTime<true>
    readonly finished: DateTime<true> | null
}
