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

function EditCampaignForm() {

    const params = useParams()

    const context = useContext(selectedCampaignContext)

    useEffect(() => {
        if (!context?.selectedCampaignId) {
            context?.setSelectedCampaignId(params.id)
        }
    }, [])


    const { data: campaignData, isLoading: isCampaignLoading, error: campaignError } = useCampaign(context?.selectedCampaignId)
    const { data: campaignEventsData, isLoading: isCampaignEventsLoading, error: campaignEventsError } = useCampaignEvents(context?.selectedCampaignId)


    const renderTemplateEvents = () => {
        let templateEventsSorted = campaignEventsData?.data?.sort((a, b) => { return b.position - a.position })
        return templateEventsSorted?.map((e: TaskObj, i: number) => {
            const eventSliceProps = {
                key: i,
                event: e,
                dataTable: 'campaign_events'
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
                {!isCampaignLoading && campaignData?.data
                    ? <h4>{campaignData?.data.name}</h4>
                    : <Spinner />
                }
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