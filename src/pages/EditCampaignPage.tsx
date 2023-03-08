import React, { useContext } from 'react'
import EditCampaignForm from '../components/EditCampaignForm'
import Section from '../components/Section'
import { useTemplate } from '../util/db'
import TableHeader from '../components/TableHeader'
import { useCampaign, useCampaignEvents } from '../util/db'
import { selectedCampaignContext } from '../contexts/SelectedCampaignContext'
import HolidaysContextProvider from '../contexts/HolidaysContext'

function EditCampaignPage() {

    const context = useContext(selectedCampaignContext)

    const { data: campaignData, isLoading: isCampaignLoading, error: campaignError } = useCampaign(context?.selectedCampaignId)
    const { data: campaignEventsData, isLoading: isCampaignEventsLoading, error: campaignEventsError } = useCampaignEvents(context?.selectedCampaignId)



    return (
        <Section flexDirection='column'>
            <TableHeader events={campaignEventsData?.data} metadata={campaignData?.data} />
            <HolidaysContextProvider >
                <EditCampaignForm />
            </HolidaysContextProvider>
        </Section>
    )
}

export default EditCampaignPage