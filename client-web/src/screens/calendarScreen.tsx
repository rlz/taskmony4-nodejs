import { Box, Palette, Stack, Typography, useTheme } from '@mui/material'
import { DateTime } from 'luxon'
import { JSX } from 'react'
import React from 'react'

import { BaseScreen } from '../components/baseScreen'
import { dateType, DAY_TYPE } from '../utils/calendar'

const YEARS = 1

export function CalendarScreen(): JSX.Element {
    const startDate = DateTime.now().startOf('year')
    const endDate = startDate.plus({ years: YEARS })

    const months: JSX.Element[] = []

    for (let date = startDate; date < endDate; date = date.plus({ month: 1 })) {
        months.push(<Month key={date.toMillis()} startDate={date} />)
    }

    return (
        <BaseScreen>
            <Stack gap={1}>
                {months}
            </Stack>
        </BaseScreen>
    )
}

interface MonthProps {
    startDate: DateTime
}

function Month({ startDate }: MonthProps): JSX.Element {
    const weeks: JSX.Element[] = []
    const weekStartDate = startDate.startOf('week')
    const endDate = startDate.plus({ month: 1 })

    for (let date = weekStartDate; date < endDate; date = date.plus({ week: 1 })) {
        weeks.push(<Week key={date.toMillis()} weekStartDate={date} monthStartDate={startDate} />)
    }

    return (
        <Stack gap={1}>
            <Typography variant={'h6'} textAlign={'center'} pt={2}>
                {startDate.toFormat('yyyy, LLLL')}
            </Typography>
            {weeks}
        </Stack>
    )
}

interface WeekProps {
    weekStartDate: DateTime<true>
    monthStartDate: DateTime<true>
}

const DAY_SIZE = 32

function Week({ weekStartDate, monthStartDate }: WeekProps): JSX.Element {
    const theme = useTheme()
    const todayDate = DateTime.now().startOf('day')

    const dates: (DateTime | null)[] = []
    for (let i = 0; i < 7; i++) {
        const date = weekStartDate.plus({ day: i })
        if (date.month === monthStartDate.month) {
            dates.push(date)
        } else {
            dates.push(null)
        }
    }

    return (
        <Stack direction={'row'} justifyContent={'center'} gap={1}>
            {dates.map((date, index) => {
                if (date === null) {
                    return <Box key={index} width={DAY_SIZE} height={DAY_SIZE} />
                }
                const dayType = dateType(date)
                const bgColor = getColorForDayType(dayType, theme.palette)
                const today = date.toMillis() === todayDate.toMillis()
                return (
                    <Box
                        key={date.toMillis()}
                        width={DAY_SIZE}
                        height={DAY_SIZE}
                        display={'inline-flex'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        bgcolor={bgColor}
                        color={theme.palette.getContrastText(bgColor)}
                        fontSize={theme.typography.body2.fontSize}
                        borderRadius={today ? 10 : 1}
                        fontWeight={today ? 'bold' : 'normal'}
                    >
                        {date.day}
                    </Box>
                )
            })}
        </Stack>
    )
}

function getColorForDayType(dayType: DAY_TYPE, palette: Palette): string {
    switch (dayType) {
        case 'working':
            return palette.mode === 'dark' ? palette.grey[800] : palette.grey[200]
        case 'short':
            return palette.warning.main
        case 'weekend':
            return palette.error.dark
        case 'holyday':
            return palette.error.main
    }
}
