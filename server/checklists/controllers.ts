import { FastifyInstance, FastifyRequest, RawServerBase } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { DateTime } from 'luxon'
import { API_COMPARISON_OBJECT_SCHEMA_V0, API_GET_OBJECTS_QUERY_STRING_SCHEMA_V0, API_GET_OBJECTS_REQUEST_SCHEMA_V0, API_ITEMS_REQUEST_SCHEMA_V0, API_ITEMS_RESPONSE_SCHEMA_V0, ApiItemsResponseV0 } from 'rlz-engine/dist/shared/api/sync'
import { toValid } from 'rlz-engine/dist/shared/utils/datetime'
import zodToJsonSchema from 'zod-to-json-schema'

import { API_CHECKLIST_SCHEMA_V0 } from '../../common/checklists'
import { ChecklistsStorage } from './storage'

interface Opts {
    storage: ChecklistsStorage
    auth: (headers: FastifyRequest['headers']) => Promise<string>
}

export const CHECKLISTS_API = fastifyPlugin(
    async function checklistsApi<T extends RawServerBase>(app: FastifyInstance<T>, { storage, auth }: Opts) {
        app.get(
            '/api/v0/checklists',
            {
                schema: {
                    querystring: zodToJsonSchema(API_GET_OBJECTS_QUERY_STRING_SCHEMA_V0),
                    response: { 200: zodToJsonSchema(API_ITEMS_RESPONSE_SCHEMA_V0(API_COMPARISON_OBJECT_SCHEMA_V0)) }
                }
            },
            async (req, _resp) => {
                const userId = await auth(req.headers)
                const query = API_GET_OBJECTS_QUERY_STRING_SCHEMA_V0.parse(req.query)
                const syncAfter = query.syncAfter !== undefined ? toValid(DateTime.fromISO(query.syncAfter)) : undefined
                return { items: await storage.allChecklists(userId, syncAfter) }
            }
        )

        app.post(
            '/api/v0/checklists/by-ids',
            {
                schema: {
                    body: zodToJsonSchema(API_GET_OBJECTS_REQUEST_SCHEMA_V0),
                    response: { 200: zodToJsonSchema(API_ITEMS_RESPONSE_SCHEMA_V0(API_CHECKLIST_SCHEMA_V0)) }
                }
            },
            async (req, _resp): Promise<ApiItemsResponseV0<typeof API_CHECKLIST_SCHEMA_V0>> => {
                const userId = await auth(req.headers)
                const ids = API_GET_OBJECTS_REQUEST_SCHEMA_V0.parse(req.body).ids
                return { items: await storage.getChecklists(userId, ids) }
            }
        )

        app.post(
            '/api/v0/checklists/push',
            {
                schema: {
                    body: zodToJsonSchema(API_ITEMS_REQUEST_SCHEMA_V0(API_CHECKLIST_SCHEMA_V0))
                },
                bodyLimit: 30 * 1024 * 1024
            },
            async (req, resp) => {
                const userId = await auth(req.headers)
                const ops = API_ITEMS_REQUEST_SCHEMA_V0(API_CHECKLIST_SCHEMA_V0).parse(req.body).items
                await storage.pushChecklists(userId, ops)
                resp.statusCode = 204
            }
        )
    }
)
