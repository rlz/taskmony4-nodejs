import { CheckBoxOutlined } from '@mui/icons-material'
import { Box, Paper, Stack, Typography, useTheme } from '@mui/material'
import React, { JSX } from 'react'

import { useEngine } from '../engine/engine'
import { FinishedTask } from '../engine/model'

interface FinishedTaskViewProps {
    task: FinishedTask

    onUndone: () => Promise<void> | void
}

const CHECK_STYLE = { lineHeight: 0 }

export function FinishedTaskView({ task, onUndone }: FinishedTaskViewProps): JSX.Element {
    const engine = useEngine()
    const theme = useTheme()

    const color = engine.palette[task.category]

    return (
        <Paper variant={'outlined'}>
            <Stack direction={'row'} justifyContent={'flex-end'} gap={1}>
                <Box
                    bgcolor={color}
                    fontSize={'0.8rem'}
                    px={1}
                    borderRadius={'0 0px 4px 4px'}
                    color={theme.palette.getContrastText(color)}
                >
                    {task.category}
                </Box>
                <Box
                    bgcolor={theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light}
                    fontSize={'0.8rem'}
                    mr={2}
                    px={1}
                    borderRadius={'0 0px 4px 4px'}
                >
                    {task.finished.toFormat('dd LLL yyyy')}
                </Box>
            </Stack>
            <Stack direction={'row'} gap={1} p={1} alignItems={'center'}>
                <a
                    style={CHECK_STYLE}
                    onClick={onUndone}
                >
                    <CheckBoxOutlined />
                </a>
                <Typography color={'textSecondary'}>{ task.title }</Typography>
            </Stack>
        </Paper>
    )
}
