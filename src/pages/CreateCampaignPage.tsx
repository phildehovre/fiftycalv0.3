import React, { useContext, useEffect } from 'react'
import CreateCampaignForm from '../components/CreateCampaignForm'
import PageContainer from '../components/PageContainer'
import Section from '../components/Section'
import Spinner from '../components/Spinner'
import { selectedTemplateContext } from '../contexts/SelectedTemplateContext'
import { useTemplates, useTemplateEvents } from '../util/db'

function CreateCampaignPage() {

    const { data, isLoading, error } = useTemplates()

    const context = useContext<any>(selectedTemplateContext)

    var { data: templateEventsData } = useTemplateEvents(context?.selectedTemplateId)

    return (
        <Section>
            {isLoading && !data && !context?.selectedTemplateId
                ? <Spinner />
                : <CreateCampaignForm templates={data?.data} templateEvents={templateEventsData?.data} />
            }
        </Section>
    )
}

export default CreateCampaignPage