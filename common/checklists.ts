import z from 'zod'

export const API_CHECKLIST_SCHEMA_V0 = z.object({
    id: z.string().uuid(),
    lastModified: z.string().datetime({ offset: true }),
    title: z.string(),
    items: z.array(z.object({
        name: z.string(),
        checked: z.boolean()
    }).readonly()).readonly()
}).readonly()

export type ApiChecklistV0 = z.infer<typeof API_CHECKLIST_SCHEMA_V0>
