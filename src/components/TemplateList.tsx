import React, { useContext } from 'react'
import { useNavigate } from 'react-router'
import { useTemplates, useCampaigns } from '../util/db'
import { selectedTemplateContext } from '../contexts/SelectedTemplateContext'
import { TemplateObj } from '../types/types'
import { selectedCampaignContext } from '../contexts/SelectedCampaignContext'
import './TemplateList.scss'
import Section from './Section'
import { useSession } from '@supabase/auth-helpers-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Tooltips from './Tooltips'
import Spinner from './Spinner'

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

                    <span className='template_list-header'>
                        <h3 >Templates</h3>
                        <FontAwesomeIcon className='create_new' icon={faPlus} size='lg' onClick={() => navigate('/dashboard/template')} />
                        <Tooltips content='Create a new template' />
                    </span>
                    {!isTemplatesLoading && templatesData &&
                        <div className='template_list-subdivision'>
                            {isTemplatesLoading
                                ? <Spinner />
                                : renderList(templatesData.data, 'template')
                            }
                        </div>
                    }
                    <span className='template_list-header'>
                        <h3 >Campaigns</h3>
                        <FontAwesomeIcon className='create_new' icon={faPlus} size='lg' onClick={() => navigate('/dashboard/campaign')} />
                        <Tooltips content='Create a new campaign' />
                    </span>
                    {
                        !isCampaignsLoading && campaignsData &&
                        <div className='template_list-subdivision'>
                            {
                                isCampaignsLoading
                                    ? <Spinner />
                                    : renderList(campaignsData.data, 'campaign')
                            }
                        </div>
                    }
                </div>
            }
        </>
    )
}

export default TemplateList