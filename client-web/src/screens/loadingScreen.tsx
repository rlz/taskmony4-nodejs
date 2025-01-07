import { Box, Stack } from '@mui/material'
import React, { JSX } from 'react'

export function LoadingScreen(): JSX.Element {
    return (
        <Stack alignItems={'center'}>
            <Box pt={'20vh'} width={'40vw'}>
                <img src={'/favicon.svg'} />
            </Box>
            <Box textAlign={'center'} fontSize={'15vw'}>{'Loading...'}</Box>
        </Stack>
    )
}
