import { Add as AddIcon } from '@mui/icons-material'
import { Stack } from '@mui/material'
import { observer } from 'mobx-react-lite'
import React, { JSX, useState } from 'react'

import { ActiveTaskView } from '../components/activeTaskView'
import { SimpleFab } from '../components/fab'
import { TaskEditor } from '../components/taskEditor'
import { useEngine } from '../engine/engine'
import { Task } from '../engine/model'
import { useAppState } from '../state'

// eslint-disable-next-line @typescript-eslint/naming-convention
export const PlannedScreenBody = observer(function PlannedScreenBody(): JSX.Element {
    const appState = useAppState()
    const engine = useEngine()
    const [editTask, setEditTask] = useState<Task | null | undefined>(undefined)

    return (
        <>
            <Stack p={1} gap={1}>
                {
                    engine.activeTasks.map((i) => {
                        return (
                            <ActiveTaskView
                                key={i.id}
                                task={i}
                                onDone={() => engine.pushTask({ ...i, finished: appState.today })}
                                onEdit={() => setEditTask(i)}
                            />
                        )
                    })
                }
                {
                    <TaskEditor
                        open={editTask !== undefined}
                        task={editTask ?? undefined}
                        onSave={(t) => {
                            engine.pushTask(t)
                            setEditTask(undefined)
                        }}
                        onCancel={() => setEditTask(undefined)}
                    />
                }
                {
                    editTask === undefined
                    && (
                        <SimpleFab
                            fabIcon={AddIcon}
                            onFabClick={() => setEditTask(null)}
                        />
                    )
                }
            </Stack>
        </>
    )
})
