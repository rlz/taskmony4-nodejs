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
import React, { PropsWithChildren, ReactNode, useEffect, useMemo } from 'react'
import { DndProvider } from 'react-dnd'
import { TouchBackend } from 'react-dnd-touch-backend'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
// import { initFrontConfig } from 'rlz-engine/dist/client/config'
import { NotFound } from 'rlz-engine/dist/client/screens/404'
import { SignupSigninScreen } from 'rlz-engine/dist/client/screens/SignupSigninScreen'
import { AuthState, AuthStateContext } from 'rlz-engine/dist/client/state/auth'

import { BaseScreen } from './components/baseScreen'
import { TasksTabs } from './components/tasksTabs'
import { Engine, EngineContext, useEngine } from './engine/engine'
import { syncAll } from './engine/sync'
import { LocalStorage } from './localstorage/storage'
import { CalendarScreenBody } from './screens/calendarScreen'
import { ChecklistsScreenBody } from './screens/checklistsScreen'
import { FinishedScreenBody } from './screens/finishedScreen'
import { LoadingScreen } from './screens/loadingScreen'
import { PlannedScreenBody } from './screens/plannedScreen'
import { TodayScreenBody } from './screens/todayScreen'
import { AppState, AppStateContext } from './state'

installIntoGlobal()
// initFrontConfig({
//     apiDomain: 'https://app.taskmony.ru/'
// })

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
        element: (
            <BaseScreen>
                <Navigate to={'/tasks/today'} />
            </BaseScreen>
        )
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
        path: '/checklists',
        element: (
            <BaseScreen>
                <ChecklistsScreenBody />
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

interface ProviderComposerProps {
    providers: ((children: ReactNode) => ReactNode)[]
}

function ProviderComposer({ providers, children }: PropsWithChildren<ProviderComposerProps>): ReactNode {
    return providers.reduce((el, provider) => provider(el), children)
}

function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

    const theme = responsiveFontSizes(
        createTheme({
            palette: {
                mode: prefersDarkMode ? 'dark' : 'light'
            }
        })
    )

    const appState = useMemo(() => new AppState(), [])
    const engine = useMemo(() => new Engine(), [])
    const authState = useMemo(() => new AuthState(), [])

    useEffect(() => {
        void (async () => {
            const localStorage = new LocalStorage(engine)
            await localStorage.loadData()

            autorun(async () => {
                if (authState.authParam !== null) {
                    void engine.activeTasks
                    void engine.finishedTasks
                    void engine.checklists
                    setTimeout(async () => {
                        await syncAll(appState, authState, engine)
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
            <ProviderComposer
                providers={[
                    c => <ThemeProvider theme={theme}>{c}</ThemeProvider>,
                    c => <LocalizationProvider dateAdapter={AdapterLuxon}>{c}</LocalizationProvider>,
                    c => <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>{c}</DndProvider>,
                    c => <AppStateContext value={appState}>{c}</AppStateContext>,
                    c => <AuthStateContext value={authState}>{c}</AuthStateContext>,
                    c => <EngineContext value={engine}>{c}</EngineContext>
                ]}
            >
                <CssBaseline />
                <WaitForInit />
            </ProviderComposer>
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
