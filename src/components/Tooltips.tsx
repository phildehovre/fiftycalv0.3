import React from 'react'
import './Tooltips.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'


function Tooltips(props: { content: string }) {

    const [show, setShow] = React.useState(false)

    const handleSetShow = () => {
        setTimeout(() => {
            if (show) {
                setShow(false)
                return
            }
            setShow(true)
        }, 500)
    }

    const { content } = props
    return (
        <div className='tooltips-ctn'
            onMouseEnter={() => handleSetShow()}
            onMouseLeave={() => setShow(false)}
        >
            <FontAwesomeIcon icon={faQuestionCircle} color='lightGrey' />

            {show &&
                < div className='tooltips'>{content}</div>
            }
        </div >
    )
}

export default Tooltips