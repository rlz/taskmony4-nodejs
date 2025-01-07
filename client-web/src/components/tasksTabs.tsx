import { Box, Tab, Tabs } from '@mui/material'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// eslint-disable-next-line @typescript-eslint/naming-convention
export const TasksTabs = observer(function TasksTabs() {
    const navigate = useNavigate()
    const location = useLocation()
    const tab = location.pathname.split('/')[2]

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
                value={tab}
                variant={'fullWidth'}
                onChange={async (_, tab) => await navigate(`/tasks/${tab}`)}
            >
                <Tab value={'today'} label={'Today'} />
                <Tab value={'planned'} label={'Planned'} />
                <Tab value={'finished'} label={'Finished'} />
            </Tabs>
        </Box>
    )
})
