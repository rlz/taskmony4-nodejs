import { CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon } from '@mui/icons-material'
import { Stack, styled, Typography } from '@mui/material'
import React, { JSX } from 'react'

import { ActiveTask } from '../engine/model'
import { useAppState } from '../state'

interface ActiveTaskViewProps {
    task: ActiveTask

    onEdit: () => Promise<void> | void
    onDone: () => Promise<void> | void
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const Action = styled('button')(({ theme }) => {
    return {
        backgroundColor: 'transparent',
        color: theme.palette.text.primary,
        border: 0,
        padding: 0,
        fontSize: theme.typography.body1.fontSize,
        textAlign: 'left'
    }
})

export function ActiveTaskView({ task, onDone, onEdit }: ActiveTaskViewProps): JSX.Element {
    const appState = useAppState()

    const age = appState.today.diff(task.date).as('days')

    return (
        <Stack direction={'row'} gap={1} alignItems={'center'}>
            <Action
                sx={{ lineHeight: 0 }}
                onClick={async (e) => {
                    e.stopPropagation()
                    await onDone()
                }}
            >
                <CheckBoxOutlineBlankIcon />
            </Action>
            <Action sx={{ flexGrow: 1, flexShrink: 1 }} onClick={onEdit}>
                { task.title }
            </Action>
            <Stack>
                <Typography
                    variant={'body2'}
                    fontStyle={'italic'}
                    color={'secondary'}
                    noWrap
                    textAlign={'right'}
                >
                    {task.category}
                </Typography>
                <Typography
                    variant={'body2'}
                    fontStyle={'italic'}
                    noWrap
                    textAlign={'right'}
                >
                    {
                        age < 0
                            ? task.date.toFormat('dd LLL yyyy')
                            : (
                                    age === 1
                                        ? '1 day'
                                        : `${age} days`
                                )
                    }
                </Typography>
            </Stack>
        </Stack>
    )
}
