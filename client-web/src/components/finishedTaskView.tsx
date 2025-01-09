import { CheckBoxOutlined } from '@mui/icons-material'
import { Stack, styled, Typography } from '@mui/material'
import React, { JSX } from 'react'

import { FinishedTask } from '../engine/model'

interface FinishedTaskViewProps {
    task: FinishedTask

    onUndone: () => Promise<void> | void
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const Action = styled('button')(({ theme }) => {
    return {
        backgroundColor: 'transparent',
        lineHeight: 0,
        color: theme.palette.text.primary,
        border: 0,
        padding: 0,
        fontSize: theme.typography.body1.fontSize,
        textAlign: 'left'
    }
})

export function FinishedTaskView({ task, onUndone }: FinishedTaskViewProps): JSX.Element {
    return (
        <Stack direction={'row'} gap={1} alignItems={'center'}>
            <Action onClick={onUndone}>
                <CheckBoxOutlined />
            </Action>
            <Typography color={'textSecondary'} flexGrow={1} flexShrink={1}>{ task.title }</Typography>
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
                    {task.finished.toFormat('dd LLL yyyy')}
                </Typography>
            </Stack>

        </Stack>
    )
}
