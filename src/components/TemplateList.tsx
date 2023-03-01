import React, { useContext } from 'react'
import { useNavigate } from 'react-router'
import { useTemplates, useCampaigns } from '../util/db'
import { selectedTemplateContext } from '../contexts/SelectedTemplateContext'
import { TemplateObj } from '../types/types'
import { selectedCampaignContext } from '../contexts/SelectedCampaignContext'
import './TemplateList.scss'
import Section from './Section'

function TemplateList() {


    const { data: templatesData, isLoading: isTemplatesLoading, error: templatesError } = useTemplates()
    const { data: campaignsData, isLoading: isCampaignsLoading, error: campaignsError } = useCampaigns()

    const navigate = useNavigate()

    const templateContext = useContext(selectedTemplateContext)
    const campaignContext = useContext(selectedCampaignContext)



    const renderList = (data: any, type: string) => {
        return data.map((e: any, i: number) => {
            return (
                <div
                    className='template-btn'
                    key={i}
                    onClick={() => {
                        if (type === 'template') {
                            templateContext?.setSelectedTemplateId(e.template_id)
                            navigate(`/${type}/${e.template_id}`)
                        }
                        if (type === 'campaign') {
                            campaignContext?.setSelectedCampaignId(e.campaign_id)
                            navigate(`/${type}/${e.campaign_id}`)
                        }
                    }}
                >{e.name}
                </div>
            )
        })
    }

    return (
        <div className='template_list-ctn'>
            <Section flexDirection='column'>

                <h3 >Templates</h3>
                {!isTemplatesLoading && templatesData &&
                    <div className='template_list-subdivision'>
                        {renderList(templatesData.data, 'template')}
                    </div>
                }
                <h3 >Campaigns</h3>
                {
                    !isCampaignsLoading && campaignsData &&
                    <div className='template_list-subdivision'>
                        {renderList(campaignsData.data, 'campaign')}
                    </div>
                }
            </Section>
        </div>
    )
}

export default TemplateList