import { DateTime } from 'luxon'
import { autorun, makeAutoObservable } from 'mobx'
import { createContext, useContext } from 'react'
import { toValid, utcToday } from 'rlz-engine/dist/shared/utils/datetime'

const LAST_SYNC_DATE_KEY = 'lastSyncDate'

export class AppState {
    today = utcToday()
    lastSyncDate: DateTime<true> | null = (() => {
        const dateStr = localStorage.getItem(LAST_SYNC_DATE_KEY)
        if (dateStr === null) {
            return null
        }
        try {
            return toValid(DateTime.fromISO(dateStr, { zone: 'utc' }))
        } catch {
            return null
        }
    })()

    constructor() {
        makeAutoObservable(this)

        setInterval(() => {
            const today = utcToday()

            if (this.today.toMillis() !== today.toMillis()) {
                this.today = today
            }
        }, 10 * 1000) // Update every 10 seconds

        autorun(() => {
            if (this.lastSyncDate === null) {
                localStorage.removeItem(LAST_SYNC_DATE_KEY)
            } else {
                localStorage.setItem(LAST_SYNC_DATE_KEY, this.lastSyncDate.toISO())
            }
        })
    }

    synced() {
        this.lastSyncDate = DateTime.utc()
    }

    clearLastSyncDate() {
        this.lastSyncDate = null
    }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AppStateContext = createContext<AppState | null>(null)

export function useAppState(): AppState {
    const e = useContext(AppStateContext)

    if (e === null) {
        throw Error('AppState is not provided')
    }

    return e
}
