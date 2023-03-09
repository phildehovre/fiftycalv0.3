import React, { useState, useEffect, useContext } from 'react'
import { TaskObj } from '../types/types'
import { useCampaign, useCampaignEvents, useDataTable, useTemplate } from '../util/db'
import { useParams, useLocation, } from 'react-router'
import { selectedCampaignContext } from '../contexts/SelectedCampaignContext'
import EventSlice from './EventSlice'
import SubmitCampaignButton from './SubmitCampaignButton'
import Spinner from './Spinner'
import Section from './Section'
import './Table.scss'
import { HolidaysContext } from '../contexts/HolidaysContext'
import { selectedDataTableContext } from '../contexts/SelectedDataTableContext'



function Table() {

    // const { type, id } = useParams()
    const dataTableContext = useContext(selectedDataTableContext)
    const res = useDataTable(dataTableContext?.dataTableType, dataTableContext?.dataTableId)


    console.log(res?.data?.data)


    return (
        <Section>
            {
                dataTableContext?.dataTableId
            }
        </Section>
    )
}

export default Table