import z from 'zod'

export const API_TASK_SCHEMA_V0 = z.object({
    id: z.string().uuid(),
    lastModified: z.string().datetime({ offset: true }),
    category: z.string(),
    title: z.string(),
    date: z.string().date(),
    finished: z.string().date().or(z.null())
})

export type ApiTaskV0 = z.infer<typeof API_TASK_SCHEMA_V0>
