import { DateTime } from 'luxon'
import { Collection } from 'mongodb'
import { logger } from 'rlz-engine/dist/back/logger'
import { MongoStorage } from 'rlz-engine/dist/back/storage/db'
import { MongoObject } from 'rlz-engine/dist/back/storage/model'
import { getAll } from 'rlz-engine/dist/back/storage/sync'
import { ApiComparisonObjectV0 } from 'rlz-engine/dist/shared/api/sync'

import { ApiTaskV0 } from '../../common/tasks'

export class TasksStorage {
    private readonly logger = logger('AuthStorage')
    private readonly mongo: MongoStorage

    constructor(mongo: MongoStorage) {
        this.mongo = mongo
    }

    async init() {
        await Promise.all([
            'tasks'
        ].map(i => this.mongo.createCollection(i)))

        await this.createIndexes()
    }

    async allTasks(ownerId: string, syncAfter?: DateTime<true>): Promise<ApiComparisonObjectV0[]> {
        return getAll(this.tasks, ownerId, syncAfter)
    }

    async getTasks(ownerId: string, ids: readonly string[]): Promise<ApiTaskV0[]> {
        const vals: ApiTaskV0[] = []
        for await (const v of this.tasks.find({ _id: { $in: ids }, ownerId })) {
            vals.push(v.data)
        }
        return vals
    }

    async pushTasks(ownerId: string, items: readonly ApiTaskV0[]) {
        await this.tasks.bulkWrite(items.map((o) => {
            return {
                replaceOne: {
                    filter: { _id: o.id, ownerId },
                    replacement: {
                        _id: o.id,
                        ownerId,
                        syncDate: new Date(),
                        data: o
                    },
                    upsert: true
                }
            }
        }))
    }

    private async createIndexes() {
        await this.mongo.createIndexes(this.tasks,
            [
                {
                    name: 'ownerId_v0',
                    key: {
                        ownerId: 1
                    }
                },
                {
                    name: 'ownerId_syncDate_v0',
                    key: {
                        ownerId: 1,
                        syncDate: 1
                    }
                }
            ]
        )
    }

    get tasks(): Collection<MongoObject<ApiTaskV0>> {
        return this.mongo.db.collection('tasks')
    }
}
