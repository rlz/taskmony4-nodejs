import './main.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { createTheme, CssBaseline, responsiveFontSizes, ThemeProvider, useMediaQuery } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { installIntoGlobal } from 'iterator-helpers-polyfill'
import { autorun } from 'mobx'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { NotFound } from 'rlz-engine/dist/client/screens/404'
import { SignupSigninScreen } from 'rlz-engine/dist/client/screens/SignupSigninScreen'
import { useAuthState } from 'rlz-engine/dist/client/state/auth'

import { Engine, EngineContext } from './engine/engine'
import { syncTasks } from './engine/sync'
import { LocalStorage } from './localstorage/storage'
import { FinishedScreen } from './screens/finishedScreen'
import { PlannedScreen } from './screens/plannedScreen'
import { TodayScreen } from './screens/todayScreen'
import { AppState, AppStateContext } from './state'

installIntoGlobal()

function LoginScreen() {
    return <SignupSigninScreen appName={'Taskmony'} />
}

const ROUTER = createBrowserRouter([
    {
        path: '/',
        Component: TodayScreen
    },
    {
        path: '/planned',
        Component: PlannedScreen
    },
    {
        path: '/finished',
        Component: FinishedScreen
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
                            <RouterProvider router={ROUTER} />
                        </EngineContext>
                    </AppStateContext>
                </LocalizationProvider>
            </ThemeProvider>
        </React.StrictMode>
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
