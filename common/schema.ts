import z from 'zod'

export const API_TASK_SCHEMA_V0 = z.object({
    id: z.string().uuid(),
    ownerId: z.string().uuid(),
    lastModified: z.string().datetime({ offset: true }),
    category: z.string(),
    title: z.string(),
    date: z.string().date(),
    finished: z.string().date().or(z.null())
})

export type ApiTaskV0 = z.infer<typeof API_TASK_SCHEMA_V0>

export const LIST_TASK_REQUEST_SCHEMA = z.object({
    modifiedSince: z.string().datetime({ offset: true }).optional()
})

export type ListTaskRequest = z.infer<typeof LIST_TASK_REQUEST_SCHEMA>

export const LIST_TASK_RESPONSE_SCHEMA = z.object({
    tasks: z.array(API_TASK_SCHEMA_V0)
})

export type ListTaskResponse = z.infer<typeof LIST_TASK_RESPONSE_SCHEMA>

export const PUSH_TASKS_REQUEST_SCHEMA = z.object({
    tasks: z.array(API_TASK_SCHEMA_V0)
})

export type PushTasksRequest = z.infer<typeof PUSH_TASKS_REQUEST_SCHEMA>

export const PUSH_TASKS_RESPONSE_SCHEMA = z.object({
    success: z.boolean()
})

export type PushTasksResponse = z.infer<typeof PUSH_TASKS_RESPONSE_SCHEMA>
