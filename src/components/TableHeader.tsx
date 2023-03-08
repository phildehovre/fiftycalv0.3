import React from 'react'
import ColumnHeaders from './ColumnHeaders'
import './TableHeader.scss'
import { omittedHeaders } from '../assets/omittedHeaders'
import Card from './Card'
import Section from './Section'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '../App'
import { deleteCalendarEvents } from '../apis/googleCalendar'
import { useNavigate } from 'react-router'
import { deleteCampaign, deleteEvents } from '../util/db'
import Spinner from './Spinner'

function TableHeader(props: {
    events?: any[] | null | undefined,
    metadata?: any
}) {
    const { events, metadata } = props
    const queryClient = useQueryClient()
    const session = useSession()
    const navigate = useNavigate()

    const [isDeleting, setIsDeleting] = React.useState(false)

    const renderMetadata = () => {
        if (metadata) {
            const keys = Object.keys(metadata)
            return keys.map((key, i) => {
                if (!omittedHeaders.includes(key)) {
                    return (
                        <div key={i} className='metadata_key_value-ctn'>
                            <span className='metadata_key'>{key}: </span>
                            <span className='metadata_value'>
                                {metadata[key]}
                            </span>
                        </div>
                    )
                }
            })
        }
    }


    const useDeleteEvents = useMutation({
        mutationFn: deleteEvents
    });

    const useDeleteCampaign = useMutation({
        mutationFn: deleteCampaign
    });


    const handleDeleteTask = (events: any, campaign_id: string) => {
        setIsDeleting(true)
        deleteCalendarEvents(events, session).then((res) => {
            useDeleteEvents.mutateAsync(campaign_id)
                .then(() => queryClient.invalidateQueries({ queryKey: ['campaign_events'] }))
                .then(() => useDeleteCampaign.mutateAsync(campaign_id))
                .then(() => queryClient.invalidateQueries({ queryKey: ['campaigns'] }))
        }).then(() => {
            setIsDeleting(false)
            navigate('/dashboard')
        }
        )
    };

    return (
        <div className='table_header-ctn'>
            <div className='metadata-ctn'>
                {renderMetadata()}
                {
                    isDeleting
                        ? <Spinner />
                        : <FontAwesomeIcon className='delete-btn' icon={faTrash} onClick={() => handleDeleteTask(events, metadata.campaign_id)} />
                }
            </div>
            <ColumnHeaders events={events} />
        </div>
    )
}

export default TableHeader