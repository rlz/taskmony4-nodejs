import { Add as AddIcon } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'
import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React, { Fragment, JSX, useState } from 'react'

import { BaseScreen } from '../components/baseScreen'
import { FinishedTaskView } from '../components/finishedTaskView'
import { useEngine } from '../engine/engine'

// eslint-disable-next-line @typescript-eslint/naming-convention
export const FinishedScreen = observer(function FinishedScreen(): JSX.Element {
    const engine = useEngine()
    const [editTask, setEditTask] = useState<string | null | undefined>(undefined)

    let day: DateTime<true> | null = null

    return (
        <BaseScreen
            fabIcon={editTask === undefined ? AddIcon : undefined}
            onFabClick={() => setEditTask(null)}
        >
            <Stack p={1} gap={1}>
                {
                    engine.finishedTasks.map((i) => {
                        const element = (
                            <Fragment key={i.id}>
                                {
                                    (day === null || day.day !== i.finished.day) && (
                                        <Typography
                                            variant={'h6'}
                                            textAlign={'center'}
                                            pt={1}
                                        >
                                            {i.finished.toFormat('dd LLLL')}
                                        </Typography>
                                    )
                                }
                                <FinishedTaskView
                                    task={i}
                                    onUndone={() => engine.pushTask({ ...i, finished: null })}
                                />
                            </Fragment>
                        )

                        day = i.finished

                        return element
                    })
                }
            </Stack>
        </BaseScreen>
    )
})
