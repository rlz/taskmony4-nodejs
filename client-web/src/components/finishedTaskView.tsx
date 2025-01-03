import { Box, Paper, Stack, Typography } from '@mui/material'
import React, { JSX } from 'react'

import { FinishedTask } from '../engine/model'

interface FinishedTaskViewProps {
    task: FinishedTask

    onUndone: () => Promise<void> | void
}

export function FinishedTaskView({ task, onUndone }: FinishedTaskViewProps): JSX.Element {
    const daysToFinish = task.finished.diff(task.date).as('days')

    return (
        <Paper variant={'outlined'}>
            <Stack p={1}>
                <Stack direction={'row'} gap={1} justifyContent={'end'}>
                    <Box flexGrow={1}>
                        <Typography variant={'body2'} component={'span'} color={'secondary'}>
                            {'Cat.: '}
                        </Typography>
                        <Typography variant={'body2'} component={'span'} color={'textSecondary'}>
                            {task.category}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography component={'span'} variant={'body2'} color={'secondary'}>
                            {'Done: '}
                        </Typography>
                        <Typography variant={'body2'} component={'span'} color={'textSecondary'}>
                            {task.finished.toFormat('dd LLL yyyy')}
                            {` (${daysToFinish === 0 ? 'same day' : (daysToFinish > 1 ? `${daysToFinish} days` : `${daysToFinish} day`)})`}
                        </Typography>
                    </Box>
                </Stack>
                <Typography color={'textSecondary'}>
                    { task.title }
                </Typography>
                <Stack direction={'row'} gap={1} alignItems={'baseline'} justifyContent={'flex-end'}>
                    <Box>
                        <Typography variant={'body2'} color={'primary'}>
                            <a onClick={onUndone}>{'Undone'}</a>
                        </Typography>
                    </Box>
                </Stack>
            </Stack>
        </Paper>
    )
}
