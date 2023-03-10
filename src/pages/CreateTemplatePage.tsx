import React from 'react'
import CreateTemplateForm from '../components/CreateTemplateForm'
import PageContainer from '../components/PageContainer'
import Section from '../components/Section'
import Card from '../components/Card'
import TemplateList from '../components/TemplateList'

function CreateTemplatePage() {

    return (
        <Section display='flex' centered={true}>
            <Card title='Create new template'>
                <CreateTemplateForm />
            </Card>
        </Section >
    )
}

export default CreateTemplatePage