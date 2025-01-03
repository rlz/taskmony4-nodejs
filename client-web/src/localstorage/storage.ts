import { type IDBPDatabase, openDB } from 'idb'

import { Engine } from '../engine/engine'
import { Task } from '../engine/model'
import { taskFromIdb, taskToIdb } from './model'

const TASK_STORE_NAME = 'tasks'

export class LocalStorage {
    private engine: Engine

    constructor(engine: Engine) {
        engine.subscribe({
            onTaskChange: t => this.putTask(t),
            onClearDate: () => this.clearData()
        })

        this.engine = engine
    }

    async loadData() {
        const tasks = await this.readAllTasks()
        this.engine.init(tasks)
    }

    private async openDb(): Promise<IDBPDatabase> {
        return await openDB('Data', 1, {
            upgrade: (database, oldVersion, _newVersion, _transaction) => {
                void (
                    async (): Promise<void> => {
                        if (oldVersion < 1) {
                            database.createObjectStore(TASK_STORE_NAME, { keyPath: 'id' })
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

    async clearData(): Promise<void> {
        const db = await this.openDb()

        await Promise.all([
            await db.clear(TASK_STORE_NAME)
        ])
    }
}
