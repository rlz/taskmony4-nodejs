import { Check as CheckIcon } from '@mui/icons-material'
import { Box, Paper, Stack, Typography } from '@mui/material'
import React, { JSX } from 'react'

import { FinishedTask } from '../engine/model'

interface FinishedTaskViewProps {
    task: FinishedTask

    onUndone: () => Promise<void> | void
}

export function FinishedTaskView({ task, onUndone }: FinishedTaskViewProps): JSX.Element {
    return (
        <Paper variant={'outlined'}>
            <Stack p={1}>
                <Stack direction={'row'} gap={1} justifyContent={'end'}>
                    <Typography variant={'body2'} color={'success'}>
                        <CheckIcon fontSize={'small'} />
                    </Typography>
                    <Box>
                        <Typography component={'span'} variant={'body2'} color={'secondary'}>
                            {'Done: '}
                        </Typography>
                        <Typography variant={'body2'} component={'span'}>
                            {task.finished.toFormat('dd LLL yyyy')}
                        </Typography>
                    </Box>
                </Stack>
                <Box>
                    { task.title }
                </Box>
                <Stack direction={'row'} gap={1} alignItems={'baseline'}>
                    <Box>
                        <Typography variant={'body2'} component={'span'} color={'secondary'}>
                            {'Cat.: '}
                        </Typography>
                        <Typography variant={'body2'} component={'span'}>
                            {task.category}
                        </Typography>
                    </Box>
                    <Box flexGrow={1}>
                        <Typography variant={'body2'} component={'span'} color={'secondary'}>
                            {'Date: '}
                        </Typography>
                        <Typography variant={'body2'} component={'span'}>
                            {task.date.toFormat('dd LLL yyyy')}
                        </Typography>
                    </Box>
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
