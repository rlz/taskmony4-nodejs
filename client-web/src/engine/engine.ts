import { action, makeObservable, observable } from 'mobx'
import { createContext, useContext } from 'react'

import { ActiveTask, FinishedTask, Task } from './model'

export interface EngineDataChangeListener {
    onTaskChange: (t: Task) => void | Promise<void>
    onClearDate: () => void | Promise<void>
}

export class Engine {
    initialised: boolean = false

    finishedTasks: readonly FinishedTask[] = []
    activeTasks: readonly ActiveTask[] = []

    private readonly subscribtions: EngineDataChangeListener[] = []

    constructor() {
        makeObservable(
            this,
            {
                initialised: observable,
                finishedTasks: observable.shallow,
                activeTasks: observable.shallow,
                pushTask: action,
                clearData: action
            }
        )
    }

    pushTask(task: Task) {
        if (task.finished === null) {
            this.activeTasks = this.activeTasks.filter(i => i.id !== task.id).concat(task).sort(activeTasksCompare)
            this.finishedTasks = this.finishedTasks.filter(i => i.id !== task.id)
        } else {
            this.activeTasks = this.activeTasks.filter(i => i.id !== task.id)
            this.finishedTasks = this.finishedTasks.filter(i => i.id !== task.id).concat(task).sort(finishedTasksCompare)
        }

        this.subscribtions.forEach(i => i.onTaskChange(task))
    }

    clearData() {
        this.activeTasks = []
        this.finishedTasks = []

        this.subscribtions.forEach(i => i.onClearDate())
    }

    subscribe(listener: EngineDataChangeListener) {
        this.subscribtions.push(listener)
    }

    init(tasks: readonly Task[]) {
        this.initialised = true

        this.finishedTasks = tasks.filter(i => i.finished !== null).sort(finishedTasksCompare)

        this.activeTasks = tasks.filter(i => i.finished === null).sort(activeTasksCompare)
    }

    requireInitialized() {
        if (!this.initialised) {
            throw Error('Uninitialized engine')
        }
    }
}

function finishedTasksCompare(i1: Task, i2: Task): number {
    if (i1.finished === null || i2.finished === null) {
        throw Error('Only finished tasks expected')
    }

    if (i1.finished < i2.finished) {
        return -1
    }

    if (i1.finished > i2.finished) {
        return 1
    }

    return 0
}

function activeTasksCompare(i1: Task, i2: Task): number {
    if (i1.date < i2.date) {
        return -1
    }

    if (i1.date > i2.date) {
        return 1
    }

    return 0
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const EngineContext = createContext<Engine | null>(null)

export function useEngine(): Engine {
    const e = useContext(EngineContext)

    if (e === null) {
        throw Error('Engine is not provided')
    }

    return e
}
