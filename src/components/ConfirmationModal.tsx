
function ConfirmationModal(props: {
    setShowConfirmationModal: (any: any) => any
    callbackFn: (...args: any) => any
    showConfirmationModal: boolean
}) {


    const {
        setShowConfirmationModal,
        callbackFn } = props

    const handleSubmit = () => {
        callbackFn()
        setShowConfirmationModal(false)
    }

    return (
        <div className='modal-bkg'>
            <div className='modal-ctn'>
                <p>
                    This will dispatch the events to your Google Calendar.
                </p>
                Are you sure you would like to proceed?
                <span>
                    <button onClick={() => { handleSubmit() }}>Submit</button>
                    <button onClick={() => setShowConfirmationModal(false)}>Cancel</button>
                </span>
            </div>
        </div>
    )
}

export default ConfirmationModal