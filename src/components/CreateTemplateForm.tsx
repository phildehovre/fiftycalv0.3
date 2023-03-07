import React from 'react'
import { useState, useContext } from 'react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../App'
import Spinner from './Spinner'
import { useNavigate } from 'react-router'
import { selectedTemplateContext } from '../contexts/SelectedTemplateContext'
import './Table.scss'


const schema = yup.object().shape({
    name: yup.string().required('A name is required'),
    description: yup.string().required('A description is required'),
    span: yup.number().required('A duration is required'),
    permissions: yup.string().required('Select a permission level'),
    // artist: yup.string().required('An artist name is required'),
})

// 'id': uuidv4().toString().split('-').join('')

function CreateEventForm() {


    console.log('rendering?')
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })


    const session = useSession()
    const navigate = useNavigate()


    const context = useContext(selectedTemplateContext)

    const addTemplate = useMutation({
        mutationFn: async (event: any) => await supabase
            .from('templates')
            .insert(event)
            .select(),
    });

    const onSubmit = (data: any) => {
        const { name, description, span, permissions } = data
        const event = {
            'name': name,
            'description': description,
            'span': span,
            'permissions': permissions,
            'template_id': uuidv4(),
            'author_id': session?.user.id
        };
        addTemplate.mutateAsync(event).then((res) => {
            if (res.data !== null) {
                context?.setSelectedTemplateId(res.data[0].template_id)
                navigate(`/dashboard/template/${res.data[0].template_id}`)
            }
        }).catch(err => alert(err))
    };

    return (
        <div>
            <h3>Create Template: </h3>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='template_form-ctn'>
                {/* <label className='form-error'>{errors.firstName?.message}</label> */}
                <div className='template_form-input-ctn'>
                    <label>Duration (in days):
                        {errors.span &&

                            <p className='form-error-msg'>Select a duration</p>
                        }
                    </label>
                    <input className='template_form-input'
                        {...register('span')}
                        name='span'
                        defaultValue='50'
                        type='number'
                        placeholder='50'
                        min='1'
                        max='100'
                    ></input>
                </div>
                <div className='template_form-input-ctn'>
                    <label>Name:

                        {errors.name &&

                            <p className='form-error-msg'>Please enter a name</p>
                        }
                    </label>
                    <input
                        {...register('name')}
                        name='name'
                        type='text' placeholder='Template name'
                        className='template_form-input'>
                    </input>
                </div>

                <div className='template_form-input-ctn'>
                    <label>Description:
                        {errors.description &&

                            <p className='form-error-msg'>Describe the new template</p>
                        }
                    </label>
                    <input
                        {...register('description')}
                        name='description'
                        type='text' placeholder='Template description'
                        className='template_form-input id'
                    ></input>
                </div>
                <div className='template_form-input-ctn'>
                    <label>Who can edit this template: </label>
                    <select
                        {...register('permissions')}
                        name='permissions'
                        className='template_form-input'
                    >
                        <option value={session?.user.id}>Myself</option>
                        <option value='user'>Members</option>
                        <option value='admin'>Admins</option>
                    </select>
                </div>
                <button type='submit'>{addTemplate.isLoading ? <Spinner /> : 'Create template'}</button>
            </form>
        </div >
    )
}

export default CreateEventForm