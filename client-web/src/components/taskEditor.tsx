import { Box, Paper, Stack, TextField, Typography } from '@mui/material'
import { DateTime } from 'luxon'
import React, { useState } from 'react'
import { JSX } from 'react'
import { uuidv7 } from 'uuidv7'

import { Task } from '../engine/model'

interface Props {
    task?: Task
    onSave: (task: Task) => Promise<void> | void
    onCancel: () => Promise<void> | void
}

export function TaskEditor({ task, onSave, onCancel }: Props): JSX.Element {
    const [taskTitle, setTaskTitle] = useState(task === undefined ? '' : task.title)

    const save = async () => {
        if (task !== undefined) {
            await onSave({
                ...task,
                lastModified: DateTime.utc(),
                title: taskTitle
            })
        } else {
            await onSave({
                id: uuidv7(),
                lastModified: DateTime.utc(),
                title: taskTitle,
                category: 'test',
                date: DateTime.utc().startOf('day'),
                finished: null
            })
        }
    }

    return (
        <Paper variant={'outlined'}>
            <Stack p={1} gap={1}>
                <Typography color={'primary'}>
                    {task === undefined ? 'New task' : 'Edit task'}
                </Typography>
                <Stack direction={'row'}>
                    <Box flexGrow={1}>
                        {'Date: '}
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
                    onKeyUp={async (e) => {
                        if (e.key === 'Enter') {
                            await save()
                        }
                    }}
                />
                <Stack direction={'row'} gap={1}>
                    <Box flexGrow={1}>
                        <Typography variant={'body2'} color={'secondary'}>
                            <a onClick={onCancel}>{'Cancel'}</a>
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant={'body2'} color={'primary'}>
                            <a onClick={save}>{'Save'}</a>
                        </Typography>
                    </Box>
                </Stack>
            </Stack>
        </Paper>
    )
}
