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
import { MainScreen } from './screens/main'
import { AppState, AppStateContext } from './state'

installIntoGlobal()

const ROUTER = createBrowserRouter([
    {
        path: '/',
        Component: MainScreen
    },
    {
        path: '/signin',
        element: <SignupSigninScreen appName={'Taskmony'} />
    },
    {
        path: '/signup',
        element: <SignupSigninScreen appName={'Taskmony'} />
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
                    await syncTasks(authState, engine, null)
                } else {
                    engine.clearData()
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
