import React from 'react'
import { TaskObj } from '../types/types'
import EventCell from './EventCell'
import { convertDaysToUnits } from '../utils/helpers'
import './EventSlice.scss'

function EventSlice(props: { event: any }) {

    const { event } = props

    const renderEventCells = () => {
        let keys = Object.keys(event)
        return keys.map((k, i) => {
            if (i < 2 || k.includes('id') || k.includes('units')) {
                return
            }
            if (k === 'position') {
                var positionConverted = convertDaysToUnits(event[k], event?.position_units) + ` ${event.position_units}`
                return (
                    <EventCell
                        units={event.position_units}
                        value={positionConverted}
                        eventId={event.id}
                        key={i}
                        type='number'
                        eventKey={k}
                    />
                )
            }
            if (k === 'completed') {
                return (
                    <EventCell
                        value={event[k]}
                        eventId={event.id}
                        key={i}
                        type='checkbox'
                        eventKey={k}
                    />
                )
            }
            return (
                <EventCell
                    value={event[k]}
                    eventId={event.id}
                    key={i}
                    type='text'
                    eventKey={k}
                />

            )
        })
    }


    return (
        <>
            <div className='event_slice-ctn'>
                {renderEventCells()}
            </div>

        </>
    )
}

export default EventSlice
