import React, { useContext, useEffect } from 'react'
import { selectedTemplateContext } from '../contexts/SelectedTemplateContext'
import { useParams } from 'react-router'
import { useTemplate, useTemplateEvents } from '../util/db'
import Spinner from '../components/Spinner'
import Section from '../components/Section'
import EditTemplateForm from '../components/EditTemplateForm'
import EditingHeader from '../components/TableHeader'
import TemplateList from '../components/TemplateList'

function EditSelectedTemplatePage() {

    const context = useContext(selectedTemplateContext)
    const params = useParams()

    const {
        data: templateData,
        isLoading: isTemplateLoading,
        error: templateError
    } = useTemplate(params.id!!)

    const {
        data: templateEventsData,
        isLoading: isTemplateEventsLoading,
        error: templateEventsError
    } = useTemplateEvents(templateData?.data.template_id)

    useEffect(() => {
        if (templateError) alert(templateError)
    }, [templateError])


    return (
        <Section >
            {!isTemplateEventsLoading && templateData && templateEventsData?.data
                ? <Section flexDirection='column'>
                    <EditingHeader events={templateEventsData?.data} metadata={templateData?.data} />
                    <EditTemplateForm template={templateData?.data} />
                </Section>
                // : <EditTemplateForm template={templateData?.data} />
                : <Spinner />
            }
        </Section>

    )
}

export default EditSelectedTemplatePage