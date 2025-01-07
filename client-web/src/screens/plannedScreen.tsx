import { Add as AddIcon } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import React, { JSX, useState } from 'react'

import { ActiveTaskView } from '../components/activeTaskView'
import { SimpleFab } from '../components/fab'
import { TaskEditor } from '../components/taskEditor'
import { useEngine } from '../engine/engine'
import { ActiveTask, Task } from '../engine/model'
import { useAppState } from '../state'

// eslint-disable-next-line @typescript-eslint/naming-convention
export const PlannedScreenBody = observer(function PlannedScreenBody(): JSX.Element {
    const appState = useAppState()
    const engine = useEngine()
    const [editTask, setEditTask] = useState<Task | null | undefined>(undefined)

    const tomorrowTasks: ActiveTask[] = []
    const in10DaysTasks: ActiveTask[] = []
    const laterTasks: ActiveTask[] = []

    const today = appState.today
    const tomorrow = today.plus({ day: 1 })
    const tenDays = today.plus({ days: 10 })
    for (const t of engine.activeTasks) {
        if (t.date <= today) {
            continue
        }
        if (t.date <= tomorrow) {
            tomorrowTasks.push(t)
            continue
        }
        if (t.date <= tenDays) {
            in10DaysTasks.push(t)
            continue
        }
        laterTasks.push(t)
    }

    return (
        <>
            <Stack p={1} gap={1}>
                {
                    tomorrowTasks.length > 0 && (
                        <>
                            <Typography variant={'h6'} textAlign={'center'} pt={1}>
                                {'Tomorrow'}
                            </Typography>
                            {
                                tomorrowTasks.map((i) => {
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
                        </>
                    )
                }
                {
                    in10DaysTasks.length > 0 && (
                        <>
                            <Typography variant={'h6'} textAlign={'center'} pt={1}>
                                {'In 2-10 days'}
                            </Typography>
                            {
                                in10DaysTasks.map((i) => {
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
                        </>
                    )
                }
                {
                    laterTasks.length > 0 && (
                        <>
                            <Typography variant={'h6'} textAlign={'center'} pt={1}>
                                {'Later'}
                            </Typography>
                            {
                                laterTasks.map((i) => {
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
                        </>
                    )
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
