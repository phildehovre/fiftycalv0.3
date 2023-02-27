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
                        <div key={i}>
                            <span className='metadata_key'>{key}: </span>
                            {metadata[key]}
                        </div>
                    )
                }
            })
        }
    }

    return (
        <div className='table_header-ctn'>
            <Section flexDirection='row'>
                <Card>
                    {renderMetadata()}
                </Card>
            </Section>
            <ColumnHeaders events={events} />
        </div>
    )
}

export default TableHeader