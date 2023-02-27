import React from 'react'
import './Card.scss'

function Card(props: { children: React.ReactNode }) {



    return (
        <div className='card-ctn'>{props.children}</div>
    )
}

export default Card