import { Close as CloseIcon } from '@mui/icons-material'
import { Button, Drawer, IconButton, Stack, TextField, Typography, useTheme } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { DateTime } from 'luxon'
import React, { useEffect, useState } from 'react'
import { JSX } from 'react'
import { utcToday } from 'rlz-engine/dist/shared/utils/datetime'
import { uuidv7 } from 'uuidv7'

import { useEngine } from '../engine/engine'
import { Task } from '../engine/model'

interface Props {
    open: boolean
    task?: Task
    onSave: (task: Task) => Promise<void> | void
    onCancel: () => Promise<void> | void
}

export function TaskEditor({ open, task, onSave, onCancel }: Props): JSX.Element {
    const engine = useEngine()
    const theme = useTheme()

    const [date, setDate] = useState(utcToday())
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState(engine.mostPopularCat)

    useEffect(() => {
        if (task !== undefined) {
            setDate(task.date)
            setTitle(task.title)
            setCategory(task.category)
        } else {
            setDate(utcToday())
            setTitle('')
            setCategory(engine.mostPopularCat)
        }
    }, [task])

    const catPalette = engine.palette

    const save = async () => {
        if (task !== undefined) {
            await onSave({
                ...task,
                lastModified: DateTime.utc(),
                title,
                date,
                category
            })
        } else {
            await onSave({
                id: uuidv7(),
                lastModified: DateTime.utc(),
                title,
                category,
                date,
                finished: null
            })
        }
    }

    return (
        <Drawer anchor={'bottom'} open={open}>
            <Stack p={1} gap={2}>
                <Stack direction={'row'} gap={1} alignItems={'center'}>
                    <Typography color={'primary'} variant={'h5'} flexGrow={1}>
                        {task === undefined ? 'New task' : 'Edit task'}
                    </Typography>
                    <IconButton size={'small'} onClick={onCancel}><CloseIcon /></IconButton>
                </Stack>
                <DatePicker
                    label={'Start date'}
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
                <TextField
                    label={'Category'}
                    size={'small'}
                    fullWidth
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    onKeyUp={async (e) => {
                        if (e.key === 'Enter') {
                            await save()
                        }
                    }}
                />
                <Stack direction={'row'} gap={1} flexWrap={'wrap'} pb={1}>
                    {
                        engine.categories.map((c) => {
                            return (
                                <a
                                    key={c}
                                    style={
                                        {
                                            borderRadius: '1000px',
                                            paddingLeft: '12px',
                                            paddingRight: '12px',
                                            paddingTop: '2px',
                                            paddingBottom: '2px',
                                            borderStyle: 'solid',
                                            borderWidth: '1px',
                                            borderColor: catPalette[c],
                                            ...(c === category && {
                                                backgroundColor: catPalette[c],
                                                color: theme.palette.getContrastText(catPalette[c])
                                            }
                                            )
                                        }
                                    }
                                    onClick={() => setCategory(c)}
                                >
                                    {c}
                                </a>
                            )
                        })
                    }
                </Stack>
                <Button
                    variant={'contained'}
                    onClick={save}
                >
                    {'Save'}
                </Button>
            </Stack>
        </Drawer>
    )
}
