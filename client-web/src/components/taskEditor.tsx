import { Close as CloseIcon } from '@mui/icons-material'
import { Button, Drawer, IconButton, Stack, styled, TextField, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { DateTime } from 'luxon'
import React, { useCallback, useEffect, useState } from 'react'
import { JSX } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { utcToday } from 'rlz-engine/dist/shared/utils/datetime'
import { uuidv7 } from 'uuidv7'

import { useEngine } from '../engine/engine'
import { Task } from '../engine/model'
import { useAppState } from '../state'

interface Props {
    open: boolean
    task?: Task
    onSave: (task: Task) => Promise<void> | void
    onCancel: () => Promise<void> | void
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const ActionLink = styled('button')(({ theme }) => {
    return {
        'padding': '4px 12px',
        'border': `solid 1px ${theme.palette.secondary.main}`,
        'borderRadius': '1000px',
        'fontSize': theme.typography.body2.fontSize,
        'color': theme.palette.secondary.main,
        'backgroundColor': 'transparent',
        '&.active': {
            color: theme.palette.secondary.contrastText,
            backgroundColor: theme.palette.secondary.main
        },
        '&:focus': {
            outline: 0
        }
    }
})

interface ActionProps {
    label: string
    active: boolean
    onClick: () => Promise<void> | void
}

function Action({ label, active, onClick }: ActionProps) {
    return <ActionLink className={active ? 'active' : undefined} onClick={onClick}>{label}</ActionLink>
}

export function TaskEditor({ open, task, onSave, onCancel }: Props): JSX.Element {
    const appState = useAppState()
    const engine = useEngine()

    const [date, setDate] = useState(appState.today)
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
    }, [task, appState.today])

    const save = useCallback(async () => {
        if (task !== undefined) {
            await onSave({
                id: task.id,
                lastModified: DateTime.utc(),
                title,
                date,
                category,
                finished: task.finished
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
            setDate(appState.today)
            setTitle('')
            setCategory(engine.mostPopularCat)
        }
    }, [date, title, category, task, onSave])

    useHotkeys('enter', () => save(), { preventDefault: true })

    const today = appState.today
    const tomorrow = today.plus({ day: 1 })
    const weekend = today.isWeekend
        ? today.plus({ day: 3 }).endOf('week').startOf('day').minus({ day: 1 })
        : today.endOf('week').startOf('day').minus({ day: 1 })
    const nextWeek = weekend.plus({ day: 2 })
    const nextMonth = today.endOf('month').startOf('day').plus({ day: 1 })

    return (
        <Drawer
            anchor={'bottom'}
            open={open}
            onClose={async (_, reason) => {
                if (reason === 'escapeKeyDown') {
                    await onCancel()
                }
            }}
        >
            <Stack p={1} gap={2}>
                <Stack direction={'row'} gap={1} alignItems={'center'}>
                    <Typography color={'primary'} variant={'h5'} flexGrow={1}>
                        {task === undefined ? 'New task' : 'Edit task'}
                    </Typography>
                    <IconButton size={'small'} onClick={onCancel}><CloseIcon /></IconButton>
                </Stack>
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
                <Stack direction={'row'} flexWrap={'wrap'} gap={1} mb={1}>
                    <Action active={today.equals(date)} label={'today'} onClick={() => setDate(today)} />
                    <Action active={tomorrow.equals(date)} label={'tomorrow'} onClick={() => setDate(tomorrow)} />
                    <Action active={weekend.equals(date)} label={'weekend'} onClick={() => setDate(weekend)} />
                    <Action active={nextWeek.equals(date)} label={'next week'} onClick={() => setDate(nextWeek)} />
                    <Action active={nextMonth.equals(date)} label={'next month'} onClick={() => setDate(nextMonth)} />
                </Stack>
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
                        engine.categories.map(
                            c => (
                                <Action
                                    key={c}
                                    active={c === category}
                                    label={c}
                                    onClick={() => setCategory(c)}
                                />
                            )
                        )
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
