import { DateTime } from 'luxon'
import { apiCall, AuthParam } from 'rlz-engine/dist/client/api/api'
import { API_COMPARISON_OBJECT_SCHEMA_V0, API_ITEMS_RESPONSE_SCHEMA_V0, ApiGetObjectsRequestV0, ApiItemsRequestV0, ApiItemsResponseV0 } from 'rlz-engine/dist/shared/api/sync'
import { z } from 'zod'

import { API_CHECKLIST_SCHEMA_V0, ApiChecklistV0 } from '../../../common/checklists'

export async function apiChecklists(auth: AuthParam, syncAfter: DateTime<true> | null): Promise<ApiItemsResponseV0<typeof API_COMPARISON_OBJECT_SCHEMA_V0>> {
    const queryString = syncAfter === null ? null : { syncAfter: syncAfter.toISO() }
    return apiCall('GET', 'v0', 'checklists', auth, queryString, null, API_ITEMS_RESPONSE_SCHEMA_V0(API_COMPARISON_OBJECT_SCHEMA_V0))
}

export async function apiChecklistsByIds(ids: readonly string[], auth: AuthParam): Promise<ApiItemsResponseV0<typeof API_CHECKLIST_SCHEMA_V0>> {
    const req: ApiGetObjectsRequestV0 = { ids }

    return apiCall('POST', 'v0', 'checklists/by-ids', auth, null, req, API_ITEMS_RESPONSE_SCHEMA_V0(API_CHECKLIST_SCHEMA_V0))
}

export async function apiPushChecklists(items: readonly ApiChecklistV0[], auth: AuthParam): Promise<void> {
    const req: ApiItemsRequestV0<typeof API_CHECKLIST_SCHEMA_V0> = {
        items
    }

    await apiCall('POST', 'v0', 'checklists/push', auth, null, req, z.undefined())
}
