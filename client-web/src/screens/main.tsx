import { Add as AddIcon, Check as CheckIcon } from '@mui/icons-material'
import { Stack } from '@mui/material'
import { observer } from 'mobx-react-lite'
import React, { JSX, useState } from 'react'

import { BaseScreen } from '../components/baseScreen'
import { TaskEditor } from '../components/taskEditor'

// eslint-disable-next-line @typescript-eslint/naming-convention
export const MainScreen = observer(function MainScreen(): JSX.Element {
    const [addMode, setAddMode] = useState(false)

    return (
        <BaseScreen
            fabIcon={addMode ? CheckIcon : AddIcon}
            onFabClick={() => setAddMode(!addMode)}
        >
            <Stack p={1}>
                {
                    addMode && (
                        <TaskEditor />
                    )
                }
            </Stack>
        </BaseScreen>
    )
})
