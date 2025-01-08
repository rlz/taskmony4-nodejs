import { ArrowRight as ArrowRightIcon, CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon, Edit as EditIcon } from '@mui/icons-material'
import { Box, Collapse, IconButton, Paper, Stack, styled, Typography } from '@mui/material'
import { DateTime } from 'luxon'
import React, { JSX, useState } from 'react'
import { TransitionGroup } from 'react-transition-group'

import { Checklist } from '../engine/model'

// eslint-disable-next-line @typescript-eslint/naming-convention
const RtIcon = styled(ArrowRightIcon)(({ theme }) => {
    return {
        'transition': theme.transitions.create('rotate'),
        '&.open': {
            rotate: '90deg'
        }
    }
})

interface Props {
    checklist: Checklist

    onOpen: () => Promise<void> | void
    onEdit: (item: Checklist) => void
}

export function ChecklistView({ checklist, onOpen, onEdit }: Props): JSX.Element {
    const [open, setOpen] = useState(false)

    return (
        <Paper variant={'outlined'}>
            <Stack direction={'row'} p={0.5} alignItems={'center'} gap={1}>
                <Box>
                    <IconButton size={'small'} onClick={() => setOpen(!open)}>
                        <RtIcon className={open ? 'open' : undefined} />
                    </IconButton>
                </Box>
                <Typography flexGrow={1} noWrap>{ checklist.title }</Typography>
                <IconButton size={'small'} onClick={onOpen}>
                    <EditIcon />
                </IconButton>
            </Stack>
            <TransitionGroup>
                {
                    open
                    && (
                        <Collapse>
                            <Stack p={1} gap={0.5}>
                                {
                                    checklist.items.map((item, index) => {
                                        return (
                                            <Stack key={index} direction={'row'} alignItems={'center'} gap={1}>
                                                <a
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                    onClick={() => {
                                                        onEdit({
                                                            ...checklist,
                                                            items: checklist.items.map((item2, index2) => {
                                                                if (index2 !== index) {
                                                                    return item2
                                                                }
                                                                return {
                                                                    name: item2.name,
                                                                    checked: !item2.checked
                                                                }
                                                            }),
                                                            lastModified: DateTime.utc()
                                                        })
                                                    }}
                                                >
                                                    {item.checked ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                                                </a>
                                                <Box>{item.name}</Box>
                                            </Stack>
                                        )
                                    })
                                }
                            </Stack>
                        </Collapse>
                    )
                }
            </TransitionGroup>
        </Paper>
    )
}
