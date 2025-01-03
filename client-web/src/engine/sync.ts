import { DateTime } from 'luxon'
import { AuthParam } from 'rlz-engine/dist/client/api/api'
import { syncItems } from 'rlz-engine/dist/client/sync'
import { toValid } from 'rlz-engine/dist/shared/utils/datetime'

import { ApiTaskV0 } from '../../../common/tasks'
import { apiPushTasks, apiTasks, apiTasksByIds } from '../api'
import { Engine } from './engine'
import { Task } from './model'

export async function syncTasks(auth: AuthParam, engine: Engine, lastSyncDate: DateTime<true> | null) {
    await syncItems({
        getRemoteLastModified: () => apiTasks(auth, lastSyncDate),
        localItems: [...engine.activeTasks, ...engine.finishedTasks],
        pushRemote: (items: readonly Task[]) => apiPushTasks(
            items.map((i): ApiTaskV0 => {
                return {
                    id: i.id,
                    lastModified: i.lastModified.toISO(),
                    title: i.title,
                    category: i.category,
                    date: i.date.toISODate(),
                    finished: i.finished?.toISODate() ?? null
                }
            }),
            auth
        ),
        getRemote: async (ids: readonly string[]) => (await apiTasksByIds(ids, auth))
            .items
            .map((a): Task => {
                return {
                    id: a.id,
                    lastModified: toValid(DateTime.fromISO(a.lastModified, { zone: 'utc' })),
                    title: a.title,
                    category: a.category,
                    date: toValid(DateTime.fromISO(a.date, { zone: 'utc' })),
                    finished: a.finished === null ? null : toValid(DateTime.fromISO(a.finished, { zone: 'utc' }))
                }
            }),
        pushLocal: (items: readonly Task[]) => items.forEach(i => engine.pushTask(i)),
        lastSyncDate
    })
}
