//@ts-nocheck

import React, { useContext } from 'react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../App'
import Spinner from './Spinner'
import { useNavigate, useParams } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import { TaskObj, TemplateObj } from '../types/types'
import { selectedTemplateContext } from '../contexts/SelectedTemplateContext'
import { convertPositionToDays } from '../utils/helpers'
import Select from './Select'


const schema = yup.object().shape({
    position: yup.number().min(1).required('A duration is required'),
    position_units: yup.string().required('A duration is required'),
    category: yup.string().required('Please chose a category'),
    description: yup.string().required('A description is required'),
    entity_responsible: yup.string().required('Select a responsible entity'),
    type: yup.string().required('Select a type of task'),
})

function CreateTaskForm(props: {
    task: object | undefined,
    type: 'edit' | 'create',
    indexOfEdited: number | null
    setIndexOfEdited: (index: number | null) => number,
    setIsCreatingTask: () => void
}) {


    const { task, setIsCreatingTask } = props
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })
    const queryClient = useQueryClient()


    const context = useContext(selectedTemplateContext)
    const params = useParams()
    const session = useSession()

    const addTemplateEvent = useMutation({
        mutationFn: async (event: any) => await supabase
            .from('template_events')
            .insert(event)
            .select(),
    });

    const updateTemplateEvent = useMutation({
        mutationFn: async (task: any) => await supabase
            .from('template_events')
            .insert(task)
            .eq('id', task.id)
        // .select()
    });

    const deleteTemplateEvent = useMutation({
        mutationFn: async (task: any) => await supabase
            .from('template_events')
            .delete()
            .eq('id', task.id)
    });

    function onSubmit(data: any) {
        const { position, type, category, entity_responsible, description, position_units } = data
        const event = {
            'position': convertPositionToDays(position, position_units),
            'position_units': position_units,
            'category': category,
            'description': description,
            'entity_responsible': entity_responsible,
            'type': type,
            'template_id': context?.selectedTemplateId || params.id,
            'author_id': session?.user.id,
        };

        if (props.type === 'edit') {

            deleteTemplateEvent.mutateAsync(task).then((res) => {
                queryClient.invalidateQueries({ queryKey: ['template_events'] })
            }
            )
            updateTemplateEvent.mutateAsync(event)
                .then((res) => { console.log(res) })
                .catch(err => { console.log(err) })
                .then((res) => {
                    queryClient.invalidateQueries({ queryKey: ['template_events'] });
                }).then(() => {
                    // props.setIsCreatingTask(false)
                    // props.setIndexOfEdited(null)
                })
            return
        }
        addTemplateEvent.mutateAsync(event).then((res) => {
            queryClient.invalidateQueries({ queryKey: ['template_events'] })
        }).catch(err => console.log(err))
    };

    return (
        <div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='task_form-ctn'>
                <div className='task_form-input-ctn'>
                    <span>
                        <input className={`task_form-input ${errors.position ? 'error' : ''}`}
                            {...register('position')}
                            name='position'
                            defaultValue={task?.position || 50}
                            type='number'
                            placeholder='50'
                            min='1'
                            max='100'
                        ></input>
                        <select
                            {...register('position_units')}
                            name='position_units'
                            className='task_form-input'
                            defaultValue={task?.position_units || 'week(s)'}
                        >
                            <option value='days'>Days before</option>
                            <option value='weeks'>Week(s) before</option>
                            <option value='months'>Month(s) before</option>
                        </select>
                    </span>
                </div>
                <div className='task_form-input-ctn'>
                    <input className={`task_form-input ${errors.category ? 'error' : ''}`}
                        {...register('category')}
                        name='category'
                        type='text' placeholder='Category'
                        defaultValue={task?.category}
                    >
                    </input>
                </div>

                <div className='task_form-input-ctn textarea'>
                    <input type='text'
                        {...register('description')}
                        name='description'
                        wrap='hard'
                        placeholder='Task description'
                        className={`task_form-input ${errors.description ? 'error' : ''}`}
                        defaultValue={task?.description}
                    ></input>
                </div>
                <div className='task_form-input-ctn'>
                    <select
                        {...register('entity_responsible')}
                        name='entity_responsible'
                        className={`task_form-input ${errors.entity_responsible ? 'error' : ''}`}
                        defaultValue={task?.entity_responsible}
                    >
                        <option value='supplier'>Supplier</option>
                        <option value='label'>Label</option>
                        <option value='pr'>PR</option>
                        <option value='distributor'>Distributor</option>
                        <option value='artist-bedmar'>Artist & Bedmar</option>
                        <option value='artist'>Artist</option>
                    </select>
                </div>
                <div className='task_form-input-ctn'>
                    <select
                        {...register('type')}
                        name='type'
                        className='task_form-input'
                        placeholder='Select...'
                    >
                        <option value='action'>Action</option>
                        <option value='creative'>Creative</option>
                        <option value='pr-radio'>PR + Radio</option>
                        <option value='promotion'>Promotion</option>
                        <option value='announcement'>Announcement</option>
                    </select>
                    <Select />
                </div>
                <button className='submit-btn' type='submit'>{addTemplateEvent.isLoading || updateTemplateEvent.isLoading ? <Spinner /> : <FontAwesomeIcon icon={faPlusSquare} />}</button>
            </form>
        </div >
    )
}

export default CreateTaskForm