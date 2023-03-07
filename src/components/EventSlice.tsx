import React from 'react'
import { TaskObj } from '../types/types'
import { convertDaysToUnits } from '../utils/helpers'
import EventCell from './EventCell'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faGoogle } from '@fortawesome/fontawesome-free-brands'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { supabase } from '../App'
import './EventSlice.scss'
import Spinner from './Spinner'
import { useSession } from '@supabase/auth-helpers-react'
import { deleteCalendarEvent } from '../apis/googleCalendar'
import Tooltips from './Tooltips'

function EventSlice(props: { event: any, dataTable: string, targetDate: any }) {

    const session = useSession()
    const { event, dataTable, targetDate } = props

    const [isHovered, setIsHovered] = React.useState(null)

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
                        dataTable={dataTable}
                        targetDate={targetDate}
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
                        dataTable={dataTable}
                        targetDate={targetDate}
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
                    dataTable={dataTable}
                    targetDate={targetDate}
                />

            )
        })
    };

    const queryClient = useQueryClient()

    const deleteEvent = useMutation({
        mutationFn: async (task: any) => await supabase
            .from(dataTable)
            .delete()
            .eq('id', task.id)
    });


    const handleDeleteTask = (task: any) => {
        deleteCalendarEvent(task.event_id, session).then((res) => {
            console.log(res)
            deleteEvent.mutateAsync(task).then((res) => {
                queryClient.invalidateQueries({ queryKey: [dataTable] })
            })
        })
    };


    return (
        <>
            <div className='event_slice-ctn'
                onMouseEnter={() => setIsHovered(event.id)}
                onMouseLeave={() => setIsHovered(null)}
            >
                {renderEventCells()}
                {isHovered &&
                    <span className='delete-btn'>
                        <button className='' >

                            {
                                deleteEvent.isLoading
                                    ? <Spinner />
                                    :
                                    <FontAwesomeIcon icon={faTrash} onClick={() => { handleDeleteTask(event) }} />
                            }

                        </button>
                    </span>
                }
            </div >

        </>
    )
}

export default EventSlice
