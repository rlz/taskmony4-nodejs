import { FastifyInstance, FastifyRequest, RawServerBase } from 'fastify'
import fp from 'fastify-plugin'
import { DateTime } from 'luxon'
import { API_GET_OBJECTS_QUERY_STRING_SCHEMA_V0, API_GET_OBJECTS_REQUEST_SCHEMA_V0, API_ITEMS_REQUEST_SCHEMA_V0, API_ITEMS_RESPONSE_SCHEMA_V0, ApiItemsResponseV0 } from 'rlz-engine/dist/server/sync/api'
import { toValid } from 'rlz-engine/dist/utils/datetime'
import zodToJsonSchema from 'zod-to-json-schema'

import { API_TASK_SCHEMA_V0 } from '../../common/schema'
import { TasksStorage } from './storage'

interface Opts {
    storage: TasksStorage
    auth: (headers: FastifyRequest['headers']) => Promise<string>
}

export const TASKS_API = fp(
    async function tasksApi<T extends RawServerBase>(app: FastifyInstance<T>, { storage, auth }: Opts) {
        app.get(
            '/api/v0/tasks',
            {
                schema: {
                    querystring: zodToJsonSchema(API_GET_OBJECTS_QUERY_STRING_SCHEMA_V0),
                    response: { 200: zodToJsonSchema(API_ITEMS_RESPONSE_SCHEMA_V0(API_TASK_SCHEMA_V0)) }
                }
            },
            async (req, _resp) => {
                const userId = await auth(req.headers)
                const query = API_GET_OBJECTS_QUERY_STRING_SCHEMA_V0.parse(req.query)
                const syncAfter = query.syncAfter !== undefined ? toValid(DateTime.fromISO(query.syncAfter)) : undefined
                return { items: await storage.allTasks(userId, syncAfter) }
            }
        )

        app.post(
            '/api/v0/tasks/by-ids',
            {
                schema: {
                    body: zodToJsonSchema(API_GET_OBJECTS_REQUEST_SCHEMA_V0),
                    response: { 200: zodToJsonSchema(API_ITEMS_RESPONSE_SCHEMA_V0(API_TASK_SCHEMA_V0)) }
                }
            },
            async (req, _resp): Promise<ApiItemsResponseV0<typeof API_TASK_SCHEMA_V0>> => {
                const userId = await auth(req.headers)
                const ids = API_GET_OBJECTS_REQUEST_SCHEMA_V0.parse(req.body).ids
                return { items: await storage.getTasks(userId, ids) }
            }
        )

        app.post(
            '/api/v0/tasks/push',
            {
                schema: {
                    body: zodToJsonSchema(API_ITEMS_REQUEST_SCHEMA_V0(API_TASK_SCHEMA_V0))
                },
                bodyLimit: 30 * 1024 * 1024
            },
            async (req, resp) => {
                const userId = await auth(req.headers)
                const ops = API_ITEMS_REQUEST_SCHEMA_V0(API_TASK_SCHEMA_V0).parse(req.body).items
                await storage.pushTasks(userId, ops)
                resp.statusCode = 204
            }
        )
    }
)
