import React from 'react'
import { useContext, useEffect } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { useMutation } from '@tanstack/react-query'
import { supabase } from '../App'
import Spinner from './Spinner'
import { useNavigate } from 'react-router'
import { selectedTemplateContext } from '../contexts/SelectedTemplateContext'
import { selectedCampaignContext, SelectedCampaignType } from '../contexts/SelectedCampaignContext'
import { TaskObj, TemplateObj } from '../types/types'
import DateTimePicker from 'react-datetime-picker'
import { formatTemplateEventsToCampaign } from '../utils/helpers'
import './CreateForm.scss'


const schema = yup.object().shape({
    name: yup.string().required('A name is required'),
    description: yup.string().required('A description is required'),
    template: yup.string().required('You must chose a template'),

})


function CreateCampaignForm(props: {
    templates: any,
    templateEvents: any,
    task?: object
}) {
    const { templates, templateEvents } = props
    const templateContext = useContext(selectedTemplateContext)
    const campaignContext = useContext(selectedCampaignContext)


    useEffect(() => {
        if (templates && templateContext?.selectedTemplateId?.length === 0) {
            templateContext?.setSelectedTemplateId(templates[0].template_id)
        }
    });

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })
    const [targetDate, setTargetDate] = React.useState<Date>()
    const session = useSession()
    const navigate = useNavigate()




    const addCampaign = useMutation({
        mutationFn: async (campaign: any) => await supabase
            .from('campaigns')
            .insert(campaign)
            .select(),
    });


    const addDateToCampaign = (campaign: any) => {
        campaign.targetDate = targetDate
        return campaign
    }

    const copyTemplateEventsToCampaignEvents = useMutation({
        mutationFn: async (templateEvents: any) => {
            await supabase
                .from('campaign_events')
                .insert(templateEvents)
        }
        // ==================Add all template events to campaign events ==============
    })

    const onSubmit = (data: any) => {
        const { template, name, description } = data
        templateContext?.setSelectedTemplateId(template)
        const campaignSansDate = {
            'name': name,
            'description': description,
            'template_id': template,
            'campaign_id': uuidv4(),
            'author_id': session?.user.id
        };


        const campaign = addDateToCampaign(campaignSansDate)

        addCampaign.mutateAsync(campaign).then((res) => {
            if (res.data !== null) {
                var campaignId = res.data[0].campaign_id
                var templateId = res.data[0].template_id

                sessionStorage.setItem('campaign_id', campaignId)
                sessionStorage.setItem('template_id', templateId)

            }
            return res
        }).then((res: any) => {
            var campaignId = res.data[0].campaign_id
            campaignContext?.setSelectedCampaignId(campaignId)
            const templateEventsFormatted = formatTemplateEventsToCampaign(templateEvents, campaignId)
            copyTemplateEventsToCampaignEvents.mutateAsync(templateEventsFormatted)
            navigate(`/dashboard/campaign/${campaignId}`)

        })
            .catch(err => alert(err))
    };


    return (
        <div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='form-ctn'>
                <div className='form-input-ctn'>
                    <label>Campaign Name:
                        {errors?.name &&
                            <p className='form-error-msg'>'You must enter a valid name'</p>
                        }
                    </label>
                    <input
                        {...register('name')}
                        name='name'
                        type='text' placeholder='Campaign name'
                        className='form-input'>
                    </input>
                </div>
                <div className='form-input-ctn'>
                    <label>Select a template: </label>
                    <select
                        {...register('template')}
                        name='template'
                        className='form-input'
                        onChange={(e) => templateContext?.setSelectedTemplateId(e.target.value)}
                    >
                        {templates?.map((e: TemplateObj, i: number) => {
                            return (
                                <option
                                    key={i}
                                    value={e.template_id}
                                >{e.name}</option>
                            )
                        })}
                    </select>
                </div>
                <div className='form-input-ctn'>
                    <label>Target date:
                        {errors?.targetDate &&
                            <p className='form-error-msg'>You must choose a duration</p>
                        }
                    </label>
                    <div className='form-input-ctn'>
                        {errors.date &&

                            <p className='form-error-msg'>You must choose a target date</p>
                        }
                        <DateTimePicker
                            {...register('targetDate')}

                            onChange={(value) => setTargetDate(value)}
                            value={targetDate}
                        />
                    </div>

                </div>
                <div className='form-input-ctn'>
                    <label>Description:
                        {errors.description &&

                            <p className='form-error-msg'>Describe the end goal of this campaign</p>
                        }
                    </label>
                    <input
                        {...register('description')}
                        name='description'
                        type='text' placeholder='Template description'
                        className='form-input id'
                    ></input>
                </div>
                <button type='submit'>{addCampaign.isLoading ? <Spinner /> : 'Create campaign'}</button>
            </form>
        </div >
    )
}

export default CreateCampaignForm