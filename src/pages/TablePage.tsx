import React from 'react'
import Section from '../components/Section'
import Table from '../components/Table'
import { useParams } from 'react-router'
import SelectedDataTableContextProvider from '../contexts/SelectedDataTableContext'

function TablePage() {
    const params = useParams()

    return (
        <Section>
            <SelectedDataTableContextProvider>
                <h3>Create new {params.type}</h3>
                <Table />
            </SelectedDataTableContextProvider>
        </Section>
    )

}

export default TablePage