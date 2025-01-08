import { Add as AddIcon } from '@mui/icons-material'
import { Stack } from '@mui/material'
import { observer } from 'mobx-react-lite'
import React, { JSX, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { ChecklistEditor } from '../components/checklistEditor'
import { ChecklistView } from '../components/checklistView'
import { SimpleFab } from '../components/fab'
import { useEngine } from '../engine/engine'
import { Checklist } from '../engine/model'

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ChecklistsScreenBody = observer(function ChecklistsScreenBody(): JSX.Element {
    const engine = useEngine()
    const [openChecklist, setOpenChecklist] = useState<Checklist | null | undefined>(undefined)

    useHotkeys('ctrl+n,/', () => setOpenChecklist(null), { preventDefault: true })

    return (
        <>
            <Stack p={1} gap={1}>
                {
                    engine.checklists.map((i) => {
                        return (
                            <ChecklistView
                                key={i.id}
                                checklist={i}
                                onOpen={() => setOpenChecklist(i)}
                                onEdit={c => engine.pushChecklist(c)}
                            />
                        )
                    })
                }
            </Stack>
            {
                openChecklist === undefined
                && (
                    <SimpleFab
                        fabIcon={AddIcon}
                        onFabClick={() => setOpenChecklist(null)}
                    />
                )
            }
            <ChecklistEditor
                open={openChecklist !== undefined}
                checklist={openChecklist ?? undefined}
                onSave={(t) => {
                    engine.pushChecklist(t)
                    setOpenChecklist(undefined)
                }}
                onCancel={() => setOpenChecklist(undefined)}
            />
        </>
    )
})
