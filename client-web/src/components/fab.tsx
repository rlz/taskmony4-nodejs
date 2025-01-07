import { Box, Fab, SxProps, useTheme } from '@mui/material'
import React from 'react'
import { ComponentType } from 'react'

interface BaseScreenProps {
    fabIcon: ComponentType
    onFabClick: () => Promise<void> | void
}

const FAB_STYLE: SxProps = {
    position: 'fixed',
    right: 16,
    bottom: 72
}

export function SimpleFab({ fabIcon, onFabClick }: BaseScreenProps) {
    const theme = useTheme()
    const FabIcon = fabIcon

    return (
        <>
            <Box height={theme.spacing(12)} />
            <Fab sx={FAB_STYLE} color={'primary'} onClick={onFabClick}>
                <FabIcon />
            </Fab>
        </>
    )
}
