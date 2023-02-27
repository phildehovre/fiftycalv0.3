import React from 'react'
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Spinner.scss'

function Spinner(props: {
    sizeProp?: string | undefined
}) {


    return (
        <FontAwesomeIcon id='spinner' icon={faSpinner} />
    )
}

export default Spinner