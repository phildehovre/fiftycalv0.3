import React, { Children } from 'react'
import { Outlet } from 'react-router-dom'
import EditCampaignPage from './EditCampaignPage'
import TemplateList from '../components/TemplateList'
import Section from '../components/Section'
import SelectedTemplateContextProvider from '../contexts/SelectedTemplateContext'
import SelectedCampaignContextProvider from '../contexts/SelectedCampaignContext'

function DashboardPage() {

    return (
        <div>
            <SelectedTemplateContextProvider>
                <SelectedCampaignContextProvider>
                    <Section>
                        <TemplateList />
                        <Outlet />
                    </Section>
                </SelectedCampaignContextProvider>
            </SelectedTemplateContextProvider>
        </div>
    )
}

export default DashboardPage