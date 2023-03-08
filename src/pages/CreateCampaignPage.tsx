import React, { useContext, useEffect } from 'react'
import CreateCampaignForm from '../components/CreateCampaignForm'
import Section from '../components/Section'
import Spinner from '../components/Spinner'
import { selectedTemplateContext } from '../contexts/SelectedTemplateContext'
import { useTemplates, useTemplateEvents } from '../util/db'
import Card from '../components/Card'

function CreateCampaignPage() {

    const { data, isLoading, error } = useTemplates()

    const context = useContext<any>(selectedTemplateContext)

    var { data: templateEventsData } = useTemplateEvents(context?.selectedTemplateId)

    return (
        <Section display='flex' centered={true}>
            {isLoading && !data && !context?.selectedTemplateId
                ? <Spinner sizeProp='6x' />
                : <Card title='Create new campaign'>
                    <CreateCampaignForm templates={data?.data} templateEvents={templateEventsData?.data} />
                </Card>
            }
        </Section>
    )
}

export default CreateCampaignPage