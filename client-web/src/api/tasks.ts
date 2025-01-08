import { DateTime } from 'luxon'
import { apiCall, AuthParam } from 'rlz-engine/dist/client/api/api'
import { API_COMPARISON_OBJECT_SCHEMA_V0, API_ITEMS_RESPONSE_SCHEMA_V0, ApiGetObjectsRequestV0, ApiItemsRequestV0, ApiItemsResponseV0 } from 'rlz-engine/dist/shared/api/sync'
import { z } from 'zod'

import { API_TASK_SCHEMA_V0, ApiTaskV0 } from '../../../common/tasks'

export async function apiTasks(auth: AuthParam, syncAfter: DateTime<true> | null): Promise<ApiItemsResponseV0<typeof API_COMPARISON_OBJECT_SCHEMA_V0>> {
    const queryString = syncAfter === null ? null : { syncAfter: syncAfter.toISO() }
    return apiCall('get', 'tasks', auth, queryString, null, API_ITEMS_RESPONSE_SCHEMA_V0(API_COMPARISON_OBJECT_SCHEMA_V0))
}

export async function apiTasksByIds(ids: readonly string[], auth: AuthParam): Promise<ApiItemsResponseV0<typeof API_TASK_SCHEMA_V0>> {
    const req: ApiGetObjectsRequestV0 = { ids }

    return apiCall('post', 'tasks/by-ids', auth, null, req, API_ITEMS_RESPONSE_SCHEMA_V0(API_TASK_SCHEMA_V0))
}

export async function apiPushTasks(items: readonly ApiTaskV0[], auth: AuthParam): Promise<void> {
    const req: ApiItemsRequestV0<typeof API_TASK_SCHEMA_V0> = {
        items
    }

    await apiCall('post', 'tasks/push', auth, null, req, z.undefined())
}
