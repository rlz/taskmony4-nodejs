import './main.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { Box, createTheme, CssBaseline, responsiveFontSizes, ThemeProvider, useMediaQuery } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { installIntoGlobal } from 'iterator-helpers-polyfill'
import { autorun } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { NotFound } from 'rlz-engine/dist/client/screens/404'
import { SignupSigninScreen } from 'rlz-engine/dist/client/screens/SignupSigninScreen'
import { useAuthState } from 'rlz-engine/dist/client/state/auth'

import { BaseScreen } from './components/baseScreen'
import { TasksTabs } from './components/tasksTabs'
import { Engine, EngineContext, useEngine } from './engine/engine'
import { syncTasks } from './engine/sync'
import { LocalStorage } from './localstorage/storage'
import { CalendarScreenBody } from './screens/calendarScreen'
import { FinishedScreenBody } from './screens/finishedScreen'
import { LoadingScreen } from './screens/loadingScreen'
import { PlannedScreenBody } from './screens/plannedScreen'
import { TodayScreenBody } from './screens/todayScreen'
import { AppState, AppStateContext } from './state'

installIntoGlobal()

function LoginScreen() {
    return <SignupSigninScreen appName={'Taskmony'} />
}

const ROUTER = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to={'/tasks'} />
    },
    {
        path: '/tasks',
        element: <Navigate to={'/tasks/today'} />
    },
    {
        path: '/tasks/today',
        element: (
            <BaseScreen>
                <TasksTabs />
                <Box overflow={'auto'} flexBasis={0} flexGrow={1}>
                    <TodayScreenBody />
                </Box>
            </BaseScreen>
        )
    },
    {
        path: '/tasks/planned',
        element: (
            <BaseScreen>
                <TasksTabs />
                <Box overflow={'auto'} flexBasis={0} flexGrow={1}>
                    <PlannedScreenBody />
                </Box>
            </BaseScreen>
        )
    },
    {
        path: '/tasks/finished',
        element: (
            <BaseScreen>
                <TasksTabs />
                <Box overflow={'auto'} flexBasis={0} flexGrow={1}>
                    <FinishedScreenBody />
                </Box>
            </BaseScreen>
        )
    },
    {
        path: '/signin',
        Component: LoginScreen
    },
    {
        path: '/signup',
        Component: LoginScreen
    },
    {
        path: '/calendar',
        element: <BaseScreen><CalendarScreenBody /></BaseScreen>
    },
    {
        path: '*',
        Component: NotFound
    }
])

function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

    const theme = responsiveFontSizes(
        createTheme({
            palette: {
                mode: prefersDarkMode ? 'dark' : 'light'
            }
        })
    )

    const appState = new AppState()
    const engine = new Engine()
    const authState = useAuthState()

    useEffect(() => {
        void (async () => {
            const localStorage = new LocalStorage(engine)
            await localStorage.loadData()

            autorun(async () => {
                if (authState.authParam !== null) {
                    void engine.activeTasks
                    void engine.finishedTasks
                    setTimeout(async () => {
                        await syncTasks(appState, authState, engine)
                    }, 0)
                } else {
                    setTimeout(() => {
                        engine.clearData()
                        appState.clearLastSyncDate()
                    }, 0)
                }
            })
        })()
    }, [])

    return (
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterLuxon}>
                    <AppStateContext value={appState}>
                        <EngineContext value={engine}>
                            <CssBaseline />
                            <WaitForInit />
                        </EngineContext>
                    </AppStateContext>
                </LocalizationProvider>
            </ThemeProvider>
        </React.StrictMode>
    )
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const WaitForInit = observer(function WaitForInit() {
    const engine = useEngine()

    return engine.initialised
        ? <RouterProvider router={ROUTER} />
        : <LoadingScreen />
})

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
