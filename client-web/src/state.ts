import { makeAutoObservable } from 'mobx'
import { createContext, useContext } from 'react'
import { utcToday } from 'rlz-engine/dist/shared/utils/datetime'

export class AppState {
    today = utcToday()

    constructor() {
        makeAutoObservable(this)

        setInterval(() => {
            const today = utcToday()

            if (this.today.toMillis() !== today.toMillis()) {
                this.today = today
            }
        }, 10 * 1000) // Update every 10 seconds
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
