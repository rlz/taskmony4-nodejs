import { Close as CloseIcon, Delete as DeleteIcon, DragIndicator as DragIndicatorIcon } from '@mui/icons-material'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer, IconButton, Stack, TextField, Typography } from '@mui/material'
import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React, { CSSProperties, useEffect, useState } from 'react'
import { JSX } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { usePreview } from 'react-dnd-preview'
import { uuidv7 } from 'uuidv7'

import { useEngine } from '../engine/engine'
import { Checklist, ChecklistItem } from '../engine/model'
import { useAppState } from '../state'

interface Props {
    open: boolean
    checklist?: Checklist
    onSave: (task: Checklist) => Promise<void> | void
    onCancel: () => Promise<void> | void
}

type ItemType = { id: number } & ChecklistItem

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ChecklistEditor = observer(function ChecklistEditor({ open, checklist, onSave, onCancel }: Props): JSX.Element {
    const appState = useAppState()
    const engine = useEngine()

    const [title, setTitle] = useState('')
    const [items, setItems] = useState<readonly ItemType[]>([])
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

    useEffect(() => {
        if (checklist !== undefined) {
            setTitle(checklist.title)
            setItems(checklist.items.map((item, id) => {
                return { ...item, id }
            }))
        } else {
            setTitle('')
            setItems([])
        }
    }, [checklist, appState.today])

    const doSave = async () => {
        if (checklist !== undefined) {
            await onSave({
                id: checklist.id,
                lastModified: DateTime.utc(),
                title,
                items: items.map((i) => {
                    return { name: i.name, checked: i.checked }
                }),
                deleted: checklist.deleted
            })
        } else {
            const deletedChecklist = engine.checklists.find(cl => cl.deleted)
            await onSave({
                id: deletedChecklist === undefined ? uuidv7() : deletedChecklist.id,
                lastModified: DateTime.utc(),
                title,
                items: items.map((i) => {
                    return { name: i.name, checked: i.checked }
                }),
                deleted: false
            })
            setTitle('')
            setItems([])
        }
    }

    const doDelete = async () => {
        if (checklist === undefined) {
            return
        }

        await onSave({
            id: checklist.id,
            lastModified: DateTime.utc(),
            title: '',
            items: [],
            deleted: true
        })
    }

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
                        {checklist === undefined ? 'New checklist' : 'Edit checklist'}
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
                            await doSave()
                        }
                    }}
                />
                <Stack gap={1} py={1} overflow={'auto'} maxHeight={'30vh'}>
                    {
                        items.map((item, index) => {
                            return (
                                <Item
                                    key={item.id}
                                    item={item}
                                    onTitleChanged={(name) => {
                                        setItems(items.map((i) => {
                                            if (item.id !== i.id) {
                                                return i
                                            }

                                            return {
                                                name,
                                                checked: item.checked,
                                                id: item.id
                                            }
                                        }))
                                    }}
                                    onDelete={() => {
                                        setItems(items.filter(i => i.id !== item.id))
                                    }}
                                    onHover={(di) => {
                                        if (di.id === item.id) {
                                            return
                                        }
                                        const newItems = items.filter(i => i.id !== di.id)
                                        newItems.splice(index, 0, di)
                                        setItems(newItems)
                                    }}
                                />
                            )
                        })
                    }
                </Stack>
                <Preview />
                <Button
                    variant={'outlined'}
                    onClick={() => setItems([...items, { checked: false, name: '', id: items.length }])}
                >
                    {'Add item'}
                </Button>
                <Button
                    variant={'contained'}
                    onClick={doSave}
                >
                    {'Save'}
                </Button>
                {
                    checklist !== undefined && (
                        <>
                            <Button
                                variant={'contained'}
                                color={'error'}
                                onClick={() => setOpenDeleteDialog(true)}
                                sx={{ mt: 2 }}
                            >
                                {'Delete'}
                            </Button>
                            <Dialog
                                open={openDeleteDialog}
                                onClose={() => setOpenDeleteDialog(false)}
                            >
                                <DialogTitle>
                                    {'Delete checklist?'}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        {'This can not be undone!'}
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setOpenDeleteDialog(false)} autoFocus>{'Cancel'}</Button>
                                    <Button
                                        onClick={async () => {
                                            await doDelete()
                                            setOpenDeleteDialog(false)
                                        }}
                                    >
                                        {'Confirm'}
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </>
                    )
                }
            </Stack>
        </Drawer>
    )
})

interface ItemProps {
    item: ItemType

    onTitleChanged: (title: string) => void
    onDelete: () => void
    onHover: (draggedItem: ItemType) => void
}

const DRAG_INDICATOR_STYLE: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'move'
}

function Item({ item, onTitleChanged, onDelete, onHover }: ItemProps): JSX.Element {
    const [_, drop] = useDrop<ItemType>({
        accept: 'item',
        hover: onHover
    })

    const [isDragging, drag] = useDrag<ItemType>({
        type: 'item',
        item,
        collect: (m) => {
            return m.isDragging()
        },
        isDragging: m => m.getItem().id === item.id
    })

    return (
        <div
            ref={(i) => {
                if (i !== null) {
                    drop(i)
                }
            }}

            style={{ opacity: isDragging ? '0' : '1' }}
        >
            <Stack direction={'row'} gap={1} alignItems={'center'}>
                <div
                    style={DRAG_INDICATOR_STYLE}
                    ref={(i) => {
                        if (i) {
                            drag(i)
                        }
                    }}
                >
                    <DragIndicatorIcon />
                </div>
                <Box flexGrow={1}>
                    <TextField
                        label={'Name'}
                        size={'small'}
                        fullWidth
                        value={item.name}
                        onChange={(e) => {
                            onTitleChanged(e.target.value)
                        }}
                    >
                    </TextField>
                </Box>
                <Box>
                    <IconButton
                        size={'small'}
                        onClick={onDelete}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Stack>
        </div>
    )
}

function Preview() {
    const preview = usePreview<ItemType, HTMLDivElement>({ placement: 'left', padding: { x: -20, y: 0 } })

    if (!preview.display) {
        return null
    }

    const { item, style, ref } = preview

    return (
        <div
            ref={ref}
            style={{ ...style, width: 'calc(100vw - 16px)' }}
        >
            <Stack direction={'row'} gap={1} alignItems={'center'}>
                <DragIndicatorIcon />
                <Box flexGrow={1}>
                    <TextField
                        label={'Name'}
                        size={'small'}
                        fullWidth
                        value={item.name}
                    >
                    </TextField>
                </Box>
                <Box>
                    <IconButton
                        size={'small'}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Stack>
        </div>
    )
}
