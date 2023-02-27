import React from 'react'
import { postEvents } from '../util/db'
import ConfirmationModal from './ConfirmationModal'
import { useSession } from '@supabase/auth-helpers-react'



function SubmitCampaignButton(props: {
    targetDate: Date
    events: Array<object>

}) {

    const session = useSession()

    const { events, targetDate } = props

    const [showConfirmationModal, setShowConfirmationModal] = React.useState(false)

    const submitEventsToGoogle = () => {
        postEvents(events, targetDate, session).then((res) => { console.log(res) })
    }

    return (
        <>
            {
                showConfirmationModal
                    ? <ConfirmationModal
                        setShowConfirmationModal={setShowConfirmationModal}
                        showConfirmationModal={showConfirmationModal}
                        callbackFn={submitEventsToGoogle}
                    />
                    : <button
                        onClick={() => { setShowConfirmationModal(true) }}>SubmitCampaignButton</button>
            }
        </>


    )
}

export default SubmitCampaignButton