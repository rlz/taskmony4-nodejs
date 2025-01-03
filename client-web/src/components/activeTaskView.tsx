import { Box, Paper, Stack, Typography } from '@mui/material'
import React, { JSX } from 'react'

import { ActiveTask } from '../engine/model'

interface ActiveTaskViewProps {
    task: ActiveTask

    onEdit: () => Promise<void> | void
    onDone: () => Promise<void> | void
}

export function ActiveTaskView({ task, onDone, onEdit }: ActiveTaskViewProps): JSX.Element {
    return (
        <Paper variant={'outlined'}>
            <Stack p={1}>
                <Stack direction={'row'} gap={1} justifyContent={'end'}>
                    <Typography color={'primary'} variant={'body2'}>
                        {'Active'}
                    </Typography>
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
                            <a onClick={onDone}>{'Done'}</a>
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant={'body2'} color={'secondary'}>
                            <a onClick={onEdit}>{'Edit'}</a>
                        </Typography>
                    </Box>
                </Stack>
            </Stack>
        </Paper>

    )
}
