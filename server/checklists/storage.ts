import { DateTime } from 'luxon'
import { Collection } from 'mongodb'
import { logger } from 'rlz-engine/dist/back/logger'
import { MongoStorage } from 'rlz-engine/dist/back/storage/db'
import { MongoObject } from 'rlz-engine/dist/back/storage/model'
import { getAll } from 'rlz-engine/dist/back/storage/sync'
import { ApiComparisonObjectV0 } from 'rlz-engine/dist/shared/api/sync'

import { ApiChecklistV0 } from '../../common/checklists'

export class ChecklistsStorage {
    private readonly logger = logger('ChecklistsStorage')
    private readonly mongo: MongoStorage

    constructor(mongo: MongoStorage) {
        this.mongo = mongo
    }

    async init() {
        await Promise.all([
            'checklists'
        ].map(i => this.mongo.createCollection(i)))

        await this.createIndexes()
    }

    async allChecklists(ownerId: string, syncAfter?: DateTime<true>): Promise<ApiComparisonObjectV0[]> {
        return getAll(this.checklists, ownerId, syncAfter)
    }

    async getChecklists(ownerId: string, ids: readonly string[]): Promise<ApiChecklistV0[]> {
        const vals: ApiChecklistV0[] = []
        for await (const v of this.checklists.find({ _id: { $in: ids }, ownerId })) {
            vals.push(v.data)
        }
        return vals
    }

    async pushChecklists(ownerId: string, items: readonly ApiChecklistV0[]) {
        await this.checklists.bulkWrite(items.map((o) => {
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
        await this.mongo.createIndexes(this.checklists,
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

    get checklists(): Collection<MongoObject<ApiChecklistV0>> {
        return this.mongo.db.collection('checklists')
    }
}
