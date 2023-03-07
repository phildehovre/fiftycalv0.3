import React from 'react'
import ConfirmationModal from './ConfirmationModal'
import { useSession } from '@supabase/auth-helpers-react'
import { useMutation } from '@tanstack/react-query'
import { postEvents } from '../util/db'



function SubmitCampaignButton(props: {
    targetDate: Date
    events: Array<object>

}) {

    const session = useSession()

    const { events, targetDate } = props

    const [showConfirmationModal, setShowConfirmationModal] = React.useState(false)

    const submitEventsToGoogle = () => {
        // postEvents(events, targetDate, session).then((res) => { console.log(res) })
        usePostEvents.mutateAsync()
            .then((res) => {
                setShowConfirmationModal(false)
                console.log(res)
            }
            )
            .catch(err => alert(err))
    }


    const usePostEvents = useMutation({
        mutationFn: () => postEvents(events, targetDate, session),
    });

    return (
        <>
            {
                showConfirmationModal
                    ? <ConfirmationModal
                        setShowConfirmationModal={setShowConfirmationModal}
                        callbackFn={submitEventsToGoogle}
                        isLoading={usePostEvents.isLoading}
                    />
                    : <button
                        onClick={() => { setShowConfirmationModal(true) }}
                        className='submit_campaign-btn'
                    >Push to Google Calendar</button>
            }
        </>


    )
}

export default SubmitCampaignButton