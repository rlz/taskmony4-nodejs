import { Add as AddIcon } from '@mui/icons-material'
import { Stack } from '@mui/material'
import { observer } from 'mobx-react-lite'
import React, { JSX, useState } from 'react'

import { ActiveTaskView } from '../components/activeTaskView'
import { BaseScreen } from '../components/baseScreen'
import { TaskEditor } from '../components/taskEditor'
import { useEngine } from '../engine/engine'
import { useAppState } from '../state'

// eslint-disable-next-line @typescript-eslint/naming-convention
export const PlannedScreen = observer(function PlannedScreen(): JSX.Element {
    const appState = useAppState()
    const engine = useEngine()
    const [editTask, setEditTask] = useState<string | null | undefined>(undefined)

    return (
        <BaseScreen
            fabIcon={editTask === undefined ? AddIcon : undefined}
            onFabClick={() => setEditTask(null)}
        >
            <Stack p={1} gap={1}>
                {
                    engine.activeTasks.map((i) => {
                        return i.id === editTask
                            ? (
                                    <TaskEditor
                                        key={i.id}
                                        task={i}
                                        onSave={(t) => {
                                            engine.pushTask(t)
                                            setEditTask(undefined)
                                        }}
                                        onCancel={() => setEditTask(undefined)}
                                    />
                                )
                            : (
                                    <ActiveTaskView
                                        key={i.id}
                                        task={i}
                                        onDone={() => engine.pushTask({ ...i, finished: appState.today })}
                                        onEdit={() => setEditTask(i.id)}
                                    />
                                )
                    })
                }
                {
                    editTask === null && (
                        <TaskEditor
                            onSave={(t) => {
                                engine.pushTask(t)
                                setEditTask(undefined)
                            }}
                            onCancel={() => setEditTask(undefined)}
                        />
                    )
                }
            </Stack>
        </BaseScreen>
    )
})