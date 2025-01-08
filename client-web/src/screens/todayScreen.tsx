import { Add as AddIcon } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'
import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React, { JSX, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { ActiveTaskView } from '../components/activeTaskView'
import { SimpleFab } from '../components/fab'
import { FinishedTaskView } from '../components/finishedTaskView'
import { TaskEditor } from '../components/taskEditor'
import { useEngine } from '../engine/engine'
import { Task } from '../engine/model'
import { useAppState } from '../state'

// eslint-disable-next-line @typescript-eslint/naming-convention
export const TodayScreenBody = observer(function TodayScreenBody(): JSX.Element {
    const appState = useAppState()
    const engine = useEngine()
    const [editTask, setEditTask] = useState<Task | null | undefined>(undefined)

    useHotkeys('ctrl+n,/', () => setEditTask(null), { preventDefault: true })

    const todayFinishedTasks = engine.finishedTasks.filter(i => i.finished.toMillis() === appState.today.toMillis())

    return (
        <>
            <Stack p={1} gap={1}>
                <Typography variant={'h6'} color={'primary'}>
                    {'Todo'}
                </Typography>
                {
                    engine.activeTasks.filter(i => i.date <= appState.today).map((i) => {
                        return (
                            <ActiveTaskView
                                key={i.id}
                                task={i}
                                onDone={() => engine.pushTask({ ...i, finished: appState.today, lastModified: DateTime.utc() })}
                                onEdit={() => setEditTask(i)}
                            />
                        )
                    })
                }
                {
                    todayFinishedTasks.length > 0 && (
                        <>
                            <Typography variant={'h6'} color={'primary'}>
                                {'Done Today'}
                            </Typography>
                            {
                                todayFinishedTasks.map((i) => {
                                    return (
                                        <FinishedTaskView
                                            key={i.id}
                                            task={i}
                                            onUndone={() => engine.pushTask({ ...i, finished: null, lastModified: DateTime.utc() })}
                                        />
                                    )
                                })
                            }
                        </>
                    )
                }
            </Stack>
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
        </>
    )
})
