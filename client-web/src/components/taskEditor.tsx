import { Box, Paper, Stack, TextField } from '@mui/material'
import { DateTime } from 'luxon'
import React, { useState } from 'react'
import { JSX } from 'react'

interface Props {
    task?: string
}

export function TaskEditor({ task }: Props): JSX.Element {
    const [taskTitle, setTaskTitle] = useState(task === undefined ? '' : task)

    return (
        <Paper variant={'outlined'}>
            <Stack p={1} gap={1}>
                <Stack direction={'row'}>
                    <Box flexGrow={1}>
                        {'Start date: '}
                        {DateTime.now().toLocaleString()}
                    </Box>
                    <Box>

                    </Box>
                </Stack>
                <TextField
                    label={task === undefined ? 'New task' : 'Edit task'}
                    size={'small'}
                    fullWidth
                    autoFocus
                    value={taskTitle}
                    onChange={e => setTaskTitle(e.target.value)}
                />
            </Stack>
        </Paper>
    )
}
