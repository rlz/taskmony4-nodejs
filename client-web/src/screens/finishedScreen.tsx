import { Add as AddIcon } from '@mui/icons-material'
import { Stack } from '@mui/material'
import { observer } from 'mobx-react-lite'
import React, { JSX, useState } from 'react'

import { BaseScreen } from '../components/baseScreen'
import { FinishedTaskView } from '../components/finishedTaskView'
import { useEngine } from '../engine/engine'

// eslint-disable-next-line @typescript-eslint/naming-convention
export const FinishedScreen = observer(function FinishedScreen(): JSX.Element {
    const engine = useEngine()
    const [editTask, setEditTask] = useState<string | null | undefined>(undefined)

    return (
        <BaseScreen
            fabIcon={editTask === undefined ? AddIcon : undefined}
            onFabClick={() => setEditTask(null)}
        >
            <Stack p={1} gap={1}>
                {
                    engine.finishedTasks.map((i) => {
                        return (
                            <FinishedTaskView
                                key={i.id}
                                task={i}
                                onUndone={() => engine.pushTask({ ...i, finished: null })}
                            />
                        )
                    })
                }
            </Stack>
        </BaseScreen>
    )
})
