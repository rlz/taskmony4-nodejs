import { Add as AddIcon } from '@mui/icons-material'
import { Box, Paper, Stack, Typography } from '@mui/material'
import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React, { JSX, useState } from 'react'

import { BaseScreen } from '../components/baseScreen'
import { TaskEditor } from '../components/taskEditor'
import { useEngine } from '../engine/engine'

// eslint-disable-next-line @typescript-eslint/naming-convention
export const MainScreen = observer(function MainScreen(): JSX.Element {
    const engine = useEngine()
    const [editTask, setEditTask] = useState<string | null | undefined>(undefined)

    const today = DateTime.utc().startOf('day')

    return (
        <BaseScreen
            fabIcon={editTask === undefined ? AddIcon : undefined}
            onFabClick={() => setEditTask(null)}
        >
            <Stack p={1} gap={1}>
                {
                    engine.activeTasks.filter(i => i.date >= today).map((i) => {
                        return i.id === editTask
                            ? (
                                    <TaskEditor
                                        task={i}
                                        onSave={(t) => {
                                            engine.pushTask(t)
                                            setEditTask(undefined)
                                        }}
                                        onCancel={() => setEditTask(undefined)}
                                    />
                                )
                            : (
                                    <Paper variant={'outlined'}>
                                        <Stack p={1}>
                                            <Box>
                                                { i.title }
                                            </Box>
                                            <Stack direction={'row'} gap={1} alignItems={'baseline'}>
                                                <Box>
                                                    <Typography variant={'body2'} component={'span'} color={'secondary'}>
                                                        {'Cat.: '}
                                                    </Typography>
                                                    <Typography variant={'body2'} component={'span'}>
                                                        {i.category}
                                                    </Typography>
                                                </Box>
                                                <Box flexGrow={1}>
                                                    <Typography variant={'body2'} component={'span'} color={'secondary'}>
                                                        {'Date: '}
                                                    </Typography>
                                                    <Typography variant={'body2'} component={'span'}>
                                                        {i.date.toFormat('dd LLL yyyy')}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant={'body2'} color={'primary'}>
                                                        <a>{'Done'}</a>
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant={'body2'} color={'secondary'}>
                                                        <a onClick={() => setEditTask(i.id)}>{'Edit'}</a>
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Stack>
                                    </Paper>
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
