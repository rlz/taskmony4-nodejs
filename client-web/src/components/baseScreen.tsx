import { Cached as CachedIcon, CalendarMonth as CalendarMonthIcon, Checklist as ChecklistIcon, FormatListBulleted as FormatListBulletedIcon } from '@mui/icons-material'
import { AppBar, BottomNavigation, BottomNavigationAction, Button, IconButton, Stack, SxProps, Toolbar, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import React, { PropsWithChildren } from 'react'
import { JSX } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { apiLogout } from 'rlz-engine/dist/client/api/auth'
import { useAuthState } from 'rlz-engine/dist/client/state/auth'

import { useEngine } from '../engine/engine'
import { syncAll } from '../engine/sync'
import { useAppState } from '../state'

const TITLE_STYLE: SxProps = {
    flexGrow: 1
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const BaseScreen = observer(function BaseScreen({ children }: PropsWithChildren): JSX.Element {
    const appState = useAppState()
    const authState = useAuthState()
    const engine = useEngine()
    const location = useLocation()
    const navigate = useNavigate()

    if (authState.id === null) {
        return <Navigate to={'/signin'} />
    }

    return (
        <Stack width={'100vw'} height={'100vh'}>
            <AppBar position={'static'}>
                <Toolbar>
                    <Typography variant={'h6'} sx={TITLE_STYLE}>{'Taskmony'}</Typography>
                    <IconButton onClick={async () => {
                        appState.clearLastSyncDate()
                        await syncAll(appState, authState, engine)
                    }}
                    >
                        <CachedIcon />
                    </IconButton>
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
            <Stack
                overflow={'auto'}
                flexGrow={1}
                flexBasis={0}
            >
                {children}
            </Stack>
            <BottomNavigation
                showLabels
                value={location.pathname.split('/')[1]}
                onChange={async (_, newValue) => {
                    await navigate(`/${newValue}`)
                }}
            >
                <BottomNavigationAction value={'tasks'} label={'Tasks'} icon={<FormatListBulletedIcon />} />
                <BottomNavigationAction value={'checklists'} label={'Checklists'} icon={<ChecklistIcon />} />
                <BottomNavigationAction value={'calendar'} label={'Calendar'} icon={<CalendarMonthIcon />} />
            </BottomNavigation>
        </Stack>
    )
})
