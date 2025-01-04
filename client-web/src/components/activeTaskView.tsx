import { Box, Paper, Stack, Typography } from '@mui/material'
import React, { JSX } from 'react'

import { ActiveTask } from '../engine/model'
import { useAppState } from '../state'

interface ActiveTaskViewProps {
    task: ActiveTask

    onEdit: () => Promise<void> | void
    onDone: () => Promise<void> | void
}

export function ActiveTaskView({ task, onDone, onEdit }: ActiveTaskViewProps): JSX.Element {
    const appState = useAppState()
    const age = appState.today.diff(task.date).as('days')
    const color = age > 5
        ? 'error'
        : (
                age > 1
                    ? 'warning'
                    : 'textPrimary'
            )

    return (
        <Paper variant={'outlined'}>
            <Stack p={1}>
                <Stack direction={'row'} gap={1}>
                    <Box flexGrow={1}>
                        <Typography variant={'body2'} component={'span'} color={'secondary'}>
                            {'Cat.: '}
                        </Typography>
                        <Typography variant={'body2'} component={'span'}>
                            {task.category}
                        </Typography>
                    </Box>
                    <Box>
                        {
                            age >= 0
                                ? (
                                        <>
                                            <Typography component={'span'} color={'secondary'} variant={'body2'}>
                                                {'Age: '}
                                            </Typography>
                                            <Typography component={'span'} color={color} variant={'body2'}>
                                                {age > 1 ? `${age} days` : `${age} day`}
                                            </Typography>
                                        </>
                                    )
                                : (
                                        <>
                                            <Typography component={'span'} color={'secondary'} variant={'body2'}>
                                                {'Date: '}
                                            </Typography>
                                            <Typography component={'span'} variant={'body2'}>
                                                {task.date.toFormat('dd LLL yyyy')}
                                            </Typography>
                                        </>
                                    )
                        }
                    </Box>
                </Stack>
                <Box>
                    { task.title }
                </Box>
                <Stack direction={'row'} gap={1} alignItems={'baseline'}>
                    <Box flexGrow={1}>
                        <Typography variant={'body2'} color={'secondary'}>
                            <a onClick={onEdit}>{'Edit'}</a>
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant={'body2'} color={'primary'}>
                            <a onClick={onDone}>{'Done'}</a>
                        </Typography>
                    </Box>
                </Stack>
            </Stack>
        </Paper>

    )
}
