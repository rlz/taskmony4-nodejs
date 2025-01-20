import { Stack, Typography } from '@mui/material'
import { DateTime } from 'luxon'
import { observer } from 'mobx-react-lite'
import React, { Fragment, JSX } from 'react'

import { FinishedTaskView } from '../components/finishedTaskView'
import { useEngine } from '../engine/engine'

// eslint-disable-next-line @typescript-eslint/naming-convention
export const FinishedScreenBody = observer(function FinishedScreenBody(): JSX.Element {
    const engine = useEngine()

    let day: DateTime<true> | null = null

    return (
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
                                onUndone={() => engine.pushTask({
                                    ...i,
                                    finished: null,
                                    lastModified: DateTime.utc()
                                })}
                            />
                        </Fragment>
                    )

                    day = i.finished

                    return element
                })
            }
        </Stack>
    )
})
