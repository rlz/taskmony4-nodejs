import { action, computed, makeObservable, observable } from 'mobx'
import { createContext, useContext } from 'react'

import { paletteGenerator } from '../utils/colors'
import { ActiveTask, Checklist, FinishedTask, Task } from './model'

export interface EngineDataChangeListener {
    onTaskChange: (t: Task) => void | Promise<void>
    onChecklistChange: (c: Checklist) => void | Promise<void>
    onClearData: () => void | Promise<void>
}

export class Engine {
    initialised: boolean = false

    finishedTasks: readonly FinishedTask[] = []
    activeTasks: readonly ActiveTask[] = []

    checklists: readonly Checklist[] = []

    private readonly subscribtions: EngineDataChangeListener[] = []

    constructor() {
        makeObservable(
            this,
            {
                initialised: observable,
                finishedTasks: observable.shallow,
                activeTasks: observable.shallow,
                checklists: observable.shallow,
                init: action,
                pushTask: action,
                pushChecklist: action,
                clearData: action,
                mostPopularCat: computed,
                categories: computed,
                palette: computed
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

    pushChecklist(checklist: Checklist) {
        this.checklists = this.checklists.filter(i => i.id !== checklist.id).concat(checklist).sort(checklistsCompare)
        this.subscribtions.forEach(i => i.onChecklistChange(checklist))
    }

    clearData() {
        this.activeTasks = []
        this.finishedTasks = []
        this.checklists = []

        this.subscribtions.forEach(i => i.onClearData())
    }

    subscribe(listener: EngineDataChangeListener) {
        this.subscribtions.push(listener)
    }

    init(tasks: readonly Task[], checklists: readonly Checklist[]) {
        this.initialised = true

        this.finishedTasks = tasks.filter(i => i.finished !== null).sort(finishedTasksCompare)

        this.activeTasks = tasks.filter(i => i.finished === null).sort(activeTasksCompare)

        this.checklists = [...checklists].sort(checklistsCompare)
    }

    requireInitialized() {
        if (!this.initialised) {
            throw Error('Uninitialized engine')
        }
    }

    get mostPopularCat(): string {
        this.requireInitialized()

        const categories = this.rankCategories

        let maxCount = 0
        let maxCategory = 'default'

        Object.entries(categories).forEach(([category, count]) => {
            if (count > maxCount) {
                maxCount = count
                maxCategory = category
            }
        })

        return maxCategory
    }

    get categories(): readonly string[] {
        this.requireInitialized()

        return Object.entries(this.rankCategories).sort((a, b) => b[1] - a[1]).map(i => i[0])
    }

    private get rankCategories(): Record<string, number> {
        this.requireInitialized()

        const tasks = [...this.finishedTasks, ...this.activeTasks].sort(activeTasksCompare)

        const categories: Record<string, number> = {}

        for (const t of tasks) {
            for (const [c, v] of Object.entries(categories)) {
                categories[c] = v * (c === t.category ? 1.03 : 0.99)
            }
            if (!(t.category in categories)) {
                categories[t.category] = 1
            }
        }

        return categories
    }

    get palette(): Record<string, string> {
        const p = paletteGenerator()
        return Object.fromEntries(this.categories.values().zip(p))
    }
}

function finishedTasksCompare(i1: Task, i2: Task): number {
    if (i1.finished === null || i2.finished === null) {
        throw Error('Only finished tasks expected')
    }

    if (i1.finished < i2.finished) {
        return 1
    }

    if (i1.finished > i2.finished) {
        return -1
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

function checklistsCompare(i1: Checklist, i2: Checklist): number {
    if (i1.lastModified < i2.lastModified) {
        return 1
    }

    if (i1.lastModified > i2.lastModified) {
        return -1
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
