import React from 'react'
import './Card.scss'

function Card(props: {
    children: React.ReactNode,
    title?: string
}) {

    const { title } = props

    return (
        <div className='card-ctn'>
            {title &&
                <h3 className='card-title'>{title}</h3>
            }
            {props.children}
        </div>
    )
}

export default Card