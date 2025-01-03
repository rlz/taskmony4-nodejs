import { AppBar, Box, Button, Fab, Stack, SxProps, Toolbar, Typography, useTheme } from '@mui/material'
import { observer } from 'mobx-react-lite'
import React, { ComponentType, PropsWithChildren } from 'react'
import { JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { apiLogout } from 'rlz-engine/dist/client/api/auth'
import { useAuthState } from 'rlz-engine/dist/client/state/auth'

const TITLE_STYLE: SxProps = {
    flexGrow: 1
}

const FAB_STYLE: SxProps = {
    position: 'fixed',
    right: 16,
    bottom: 16
}

interface BaseScreenProps {
    fabIcon?: ComponentType
    onFabClick?: () => Promise<void> | void
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const BaseScreen = observer(function BaseScreen({ children, fabIcon, onFabClick }: PropsWithChildren<BaseScreenProps>): JSX.Element {
    const authState = useAuthState()
    const theme = useTheme()

    const FabIcon = fabIcon

    if (authState.id === null) {
        return <Navigate to={'/signin'} />
    }

    return (
        <Stack width={'100vw'} height={'100vh'}>
            <AppBar position={'static'}>
                <Toolbar>
                    <Typography variant={'h6'} sx={TITLE_STYLE}>{'Taskmony'}</Typography>
                    <Button
                        onClick={async () => {
                            if (authState.authParam === null) {
                                throw Error('Not logged in')
                            }

                            await apiLogout(authState.authParam)
                            authState.logout()
                        }}
                        color={'inherit'}
                    >
                        {'Signout'}
                    </Button>
                </Toolbar>
            </AppBar>
            <Box
                overflow={'auto'}
                color={'white'}
                flexGrow={1}
                flexBasis={0}
            >
                {children}
                {
                    onFabClick !== undefined && FabIcon !== undefined && (
                        <>
                            <Box height={theme.spacing(12)} />
                            <Fab sx={FAB_STYLE} color={'primary'} onClick={onFabClick}>
                                <FabIcon />
                            </Fab>
                        </>
                    )
                }
            </Box>
        </Stack>
    )
})
