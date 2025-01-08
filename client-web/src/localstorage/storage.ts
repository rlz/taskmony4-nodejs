import { type IDBPDatabase, openDB } from 'idb'

import { Engine } from '../engine/engine'
import { Checklist, Task } from '../engine/model'
import { checklistFromIdb, checklistToIdb, taskFromIdb, taskToIdb } from './model'

const TASK_STORE_NAME = 'tasks'
const CHECKLIST_STORE_NAME = 'checklists'

export class LocalStorage {
    private engine: Engine

    constructor(engine: Engine) {
        engine.subscribe({
            onTaskChange: t => this.putTask(t),
            onChecklistChange: c => this.putChecklist(c),
            onClearDate: () => this.clearData()
        })

        this.engine = engine
    }

    async loadData() {
        const tasks = await this.readAllTasks()
        const checklists = await this.readAllChecklists()
        this.engine.init(tasks, checklists)
    }

    private async openDb(): Promise<IDBPDatabase> {
        return await openDB('Data', 2, {
            upgrade: (database, oldVersion, _newVersion, _transaction) => {
                void (
                    async (): Promise<void> => {
                        if (oldVersion < 1) {
                            database.createObjectStore(TASK_STORE_NAME, { keyPath: 'id' })
                        }

                        if (oldVersion < 2) {
                            database.createObjectStore(CHECKLIST_STORE_NAME, { keyPath: 'id' })
                        }
                    }
                )()
            }
        })
    }

    async readAllTasks(): Promise<Task[]> {
        const db = await this.openDb()
        const tasks = await db.getAll(TASK_STORE_NAME)
        return (tasks).map(taskFromIdb)
    }

    async putTask(task: Task): Promise<void> {
        const db = await this.openDb()
        await db.put(
            TASK_STORE_NAME,
            taskToIdb(task)
        )
    }

    async readAllChecklists(): Promise<Checklist[]> {
        const db = await this.openDb()
        const checklists = await db.getAll(CHECKLIST_STORE_NAME)
        return (checklists).map(checklistFromIdb)
    }

    async putChecklist(checklist: Checklist): Promise<void> {
        const db = await this.openDb()
        await db.put(
            CHECKLIST_STORE_NAME,
            checklistToIdb(checklist)
        )
    }

    async clearData(): Promise<void> {
        const db = await this.openDb()

        await Promise.all([
            await db.clear(TASK_STORE_NAME),
            await db.clear(CHECKLIST_STORE_NAME)
        ])
    }
}
