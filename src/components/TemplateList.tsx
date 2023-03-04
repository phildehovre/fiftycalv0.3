import React, { useContext } from 'react'
import { useNavigate } from 'react-router'
import { useTemplates, useCampaigns } from '../util/db'
import { selectedTemplateContext } from '../contexts/SelectedTemplateContext'
import { TemplateObj } from '../types/types'
import { selectedCampaignContext } from '../contexts/SelectedCampaignContext'
import './TemplateList.scss'
import Section from './Section'
import { useSession } from '@supabase/auth-helpers-react'

function TemplateList() {


    const { data: templatesData, isLoading: isTemplatesLoading, error: templatesError } = useTemplates()
    const { data: campaignsData, isLoading: isCampaignsLoading, error: campaignsError } = useCampaigns()

    const navigate = useNavigate()
    const session = useSession()

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
                            navigate(`/dashboard/${type}/${e.template_id}`)
                        }
                        if (type === 'campaign') {
                            campaignContext?.setSelectedCampaignId(e.campaign_id)
                            navigate(`/dashboard/${type}/${e.campaign_id}`)
                        }
                    }}
                >{e.name}
                </div>
            )
        })
    }

    return (
        <>
            {
                session?.user &&
                <div className='template_list-ctn'>

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
                </div>
            }
        </>
    )
}

export default TemplateList