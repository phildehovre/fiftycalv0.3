import React, { useState, useEffect, useContext } from 'react'
import { TaskObj } from '../types/types'
import { useCampaign, useCampaignEvents } from '../util/db'
import { useParams, useLocation, } from 'react-router'
import { selectedCampaignContext } from '../contexts/SelectedCampaignContext'
import EventSlice from './EventSlice'
import SubmitCampaignButton from './SubmitCampaignButton'
import Spinner from './Spinner'
import Section from './Section'
import './Table.scss'
import { HolidaysContext } from '../contexts/HolidaysContext'



function EditCampaignForm() {

    const params = useParams()

    const campaignContext = useContext(selectedCampaignContext)
    const holidaysContext = useContext(HolidaysContext)


    useEffect(() => {
        if (!campaignContext?.selectedCampaignId) {
            campaignContext?.setSelectedCampaignId(params.id)
            console.log(params)
        }
    }, [])


    const { data: campaignData, isLoading: isCampaignLoading, error: campaignError } = useCampaign(campaignContext?.selectedCampaignId)
    const { data: campaignEventsData, isLoading: isCampaignEventsLoading, error: campaignEventsError } = useCampaignEvents(campaignContext?.selectedCampaignId)


    const renderTemplateEvents = () => {
        let templateEventsSorted = campaignEventsData?.data?.sort((a, b) => { return b.position - a.position })
        return templateEventsSorted?.map((e: TaskObj, i: number) => {
            const eventSliceProps = {
                key: i,
                event: e,
                dataTable: 'campaign_events',
                targetDate: campaignData?.data.targetDate
            }
            return (
                <EventSlice
                    {...eventSliceProps}
                />
            )
        })
    }

    return (
        <Section>
            <div className='campaign_flex-ctn'>
                {!isCampaignLoading && campaignData?.data && campaignEventsData?.data &&
                    <>
                        {renderTemplateEvents()}
                        <SubmitCampaignButton targetDate={campaignData?.data.targetDate} events={campaignEventsData?.data} />
                    </>
                }
            </div>
        </Section>
    )
}

export default EditCampaignForm