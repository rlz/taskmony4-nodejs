import { DateTime } from 'luxon'

export type DAY_TYPE = 'working' | 'short' | 'weekend' | 'holyday'

export interface WorkDays {
    nonWorkingDay: Set<string>
    shortDay: Set<string>
    workingDay: Set<string>
}

export function dateType(date: DateTime): DAY_TYPE {
    const year = date.year
    const monthDay = date.toFormat('MMdd')

    const yearWorkDays = WORK_CAL[year]

    if (yearWorkDays !== undefined) {
        if (yearWorkDays.nonWorkingDay.has(monthDay)) {
            return 'holyday'
        }
        if (yearWorkDays.shortDay.has(monthDay)) {
            return 'short'
        }
        if (yearWorkDays.workingDay.has(monthDay)) {
            return 'working'
        }
    }

    const weekday = date.weekday
    if (weekday === 6 || weekday === 7) {
        return 'weekend'
    }

    return 'working'
}

export const WORK_CAL: Record<string, WorkDays> = {
    2025: {
        nonWorkingDay: new Set([
            '0101', '0102', '0103', '0106', '0107', '0108',
            '0501', '0502', '0508', '0509',
            '0612', '0613',
            '1103', '1104',
            '1231'
        ]),
        shortDay: new Set(['0307', '0430', '0611', '1101']),
        workingDay: new Set(['1101'])
    }
}
