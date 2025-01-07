import { Add as AddIcon } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'
import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React, { JSX, useState } from 'react'

import { ActiveTaskView } from '../components/activeTaskView'
import { BaseScreen } from '../components/baseScreen'
import { FinishedTaskView } from '../components/finishedTaskView'
import { TaskEditor } from '../components/taskEditor'
import { useEngine } from '../engine/engine'
import { useAppState } from '../state'

// eslint-disable-next-line @typescript-eslint/naming-convention
export const TodayScreen = observer(function TodayScreen(): JSX.Element {
    const appState = useAppState()
    const engine = useEngine()
    const [editTask, setEditTask] = useState<string | null | undefined>(undefined)

    const todayFinishedTasks = engine.finishedTasks.filter(i => i.finished.toMillis() === appState.today.toMillis())

    return (
        <BaseScreen
            fabIcon={editTask === undefined ? AddIcon : undefined}
            onFabClick={() => setEditTask(null)}
        >
            <Stack p={1} gap={1}>
                <Typography variant={'h6'} color={'primary'}>
                    {'Todo'}
                </Typography>
                {
                    engine.activeTasks.filter(i => i.date <= appState.today).map((i) => {
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
                                        onDone={() => engine.pushTask({ ...i, finished: appState.today, lastModified: DateTime.utc() })}
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
        </BaseScreen>
    )
})
