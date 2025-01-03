import './main.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { createTheme, CssBaseline, responsiveFontSizes, ThemeProvider, useMediaQuery } from '@mui/material'
import { installIntoGlobal } from 'iterator-helpers-polyfill'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { NotFound } from 'rlz-engine/dist/client/screens/404'
import { SignupSigninScreen } from 'rlz-engine/dist/client/screens/SignupSigninScreen'

import { MainScreen } from './screens/main'

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

    return (
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <RouterProvider router={ROUTER} />
            </ThemeProvider>
        </React.StrictMode>
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
