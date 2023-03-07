import React from 'react'
import ColumnHeaders from './ColumnHeaders'
import './TableHeader.scss'
import { omittedHeaders } from '../assets/omittedHeaders'
import Card from './Card'
import Section from './Section'

function TableHeader(props: {
    events?: any[] | null | undefined,
    metadata?: any
}) {
    const { events, metadata } = props

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

    return (
        <div className='table_header-ctn'>
            <div className='metadata-ctn'>
                {renderMetadata()}
            </div>
            <ColumnHeaders events={events} />
        </div>
    )
}

export default TableHeader