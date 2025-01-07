import { CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon } from '@mui/icons-material'
import { Box, Paper, Stack, Typography, useTheme } from '@mui/material'
import React, { JSX } from 'react'

import { useEngine } from '../engine/engine'
import { ActiveTask } from '../engine/model'
import { useAppState } from '../state'

interface ActiveTaskViewProps {
    task: ActiveTask

    onEdit: () => Promise<void> | void
    onDone: () => Promise<void> | void
}

const CHECK_STYLE = { lineHeight: 0 }

export function ActiveTaskView({ task, onDone, onEdit }: ActiveTaskViewProps): JSX.Element {
    const appState = useAppState()
    const engine = useEngine()
    const theme = useTheme()

    const age = appState.today.diff(task.date).as('days')
    const color = engine.palette[task.category]

    return (
        <Paper variant={'outlined'}>
            <a onClick={onEdit}>
                <Stack direction={'row'} justifyContent={'flex-end'} gap={1}>
                    <Typography
                        bgcolor={color}
                        fontSize={'0.8rem'}
                        px={1}
                        borderRadius={'0 0px 4px 4px'}
                        color={theme.palette.getContrastText(color)}
                    >
                        {task.category}
                    </Typography>
                    <Box
                        bgcolor={theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light}
                        fontSize={'0.8rem'}
                        mr={2}
                        px={1}
                        borderRadius={'0 0px 4px 4px'}
                    >
                        {
                            age >= 0
                                ? (
                                        age > 1 || age === 0 ? `${age} days` : `${age} day`
                                    )
                                : (
                                        task.date.toFormat('dd LLL yyyy')
                                    )
                        }
                    </Box>
                </Stack>
                <Stack direction={'row'} gap={1} p={1} alignItems={'center'}>
                    <a
                        style={CHECK_STYLE}
                        onClick={async (e) => {
                            e.stopPropagation()
                            await onDone()
                        }}
                    >
                        <CheckBoxOutlineBlankIcon />
                    </a>
                    <Box>{ task.title }</Box>
                </Stack>
            </a>
        </Paper>

    )
}
