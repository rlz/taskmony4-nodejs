import { Box, Stack } from '@mui/material'
import React, { JSX } from 'react'

export function LoadingScreen(): JSX.Element {
    return (
        <Stack alignItems={'center'}>
            <Box pt={'20vh'} width={'min(30vw, 20vh)'}>
                <img src={'/icon.svg'} />
            </Box>
            <Box
                textAlign={'center'}
                fontSize={'min(12vw, 8vh)'}
            >
                {'Loading...'}
            </Box>
        </Stack>
    )
}
