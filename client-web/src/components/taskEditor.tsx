import { Box, Paper, Stack, TextField, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { DateTime } from 'luxon'
import React, { useState } from 'react'
import { JSX } from 'react'
import { utcToday } from 'rlz-engine/dist/shared/utils/datetime'
import { uuidv7 } from 'uuidv7'

import { Task } from '../engine/model'

interface Props {
    task?: Task
    onSave: (task: Task) => Promise<void> | void
    onCancel: () => Promise<void> | void
}

export function TaskEditor({ task, onSave, onCancel }: Props): JSX.Element {
    const [date, setDate] = useState(task === undefined ? utcToday() : task.date)
    const [title, setTitle] = useState(task === undefined ? '' : task.title)

    const save = async () => {
        if (task !== undefined) {
            await onSave({
                ...task,
                lastModified: DateTime.utc(),
                title,
                date
            })
        } else {
            await onSave({
                id: uuidv7(),
                lastModified: DateTime.utc(),
                title,
                category: 'test',
                date,
                finished: null
            })
        }
    }

    return (
        <Paper variant={'outlined'}>
            <Stack p={1} gap={1}>
                <Typography color={'primary'} variant={'h6'}>
                    {task === undefined ? 'New task' : 'Edit task'}
                </Typography>
                <Stack direction={'row'} gap={1} alignItems={'baseline'}>
                    <Typography variant={'body2'} color={'secondary'}>
                        {'Date:'}
                    </Typography>
                    <DatePicker
                        sx={{ mb: 1 }}
                        format={'dd LLL yyyy'}
                        value={date}
                        onAccept={d => setDate(d!)}
                        timezone={'system'}
                        slotProps={{
                            textField: {
                                size: 'small'
                            }
                        }}
                    />
                </Stack>
                {
                    // showDatePicker && (
                    //     <Calendar />
                    // )
                }
                <TextField
                    label={'Title'}
                    size={'small'}
                    fullWidth
                    autoFocus
                    value={title}
                    onChange={e => setTitle(e.target.value)}
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
