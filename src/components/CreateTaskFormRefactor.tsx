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
import { selectedTemplateContext } from '../contexts/SelectedTemplateContext'
import { convertPositionToDays } from '../utils/helpers'
import Select from './Select'
import { entityOptions, typeOptions } from '../assets/selectOptions'
import './CreateTaskForm.scss'


const schema = yup.object().shape({
    position: yup.number().min(1).required('A duration is required'),
    position_units: yup.string().required('A duration is required'),
    category: yup.string().required('Please chose a category'),
    description: yup.string().required('A description is required'),
    entity_responsible: yup.string().required('Select a responsible entity'),
    type: yup.string().required('Select a type of task'),
})

function CreateTaskFormRefactor(props: {
    setIsCreatingTask: React.Dispatch<any>
}) {


    const { setIsCreatingTask } = props
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


    function onSubmit(data: any) {
        console.log(data)
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

        addTemplateEvent.mutateAsync(event).then((res) => {
            queryClient.invalidateQueries({ queryKey: ['template_events'] })
            setIsCreatingTask(false)
        }).catch(err => console.log(err))
    };
    console.log(errors)
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='task_form-ctn'>
            <div className='task_form-input-ctn'>
                <span className='task_form-span'>
                    <input className={`task_form-input ${errors.position ? 'error' : ''}`}
                        {...register('position')}
                        name='position'
                        type='number'
                        placeholder='50'
                        min='1'
                        max='100'
                    ></input>
                    <select
                        {...register('position_units')}
                        name='position_units'
                        className='task_form-input'
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
                >
                </input>
            </div>

            <div className='task_form-input-ctn textarea'>
                <input type='text'
                    {...register('description')}
                    name='description'
                    placeholder='Task description'
                    className={`task_form-input ${errors.description ? 'error' : ''}`}
                ></input>
            </div>
            <div className='task_form-input-ctn'>
                <Select
                    formRegisterType='type'
                    options={typeOptions}
                    register={register}
                // {...register('type')}
                />
            </div>
            <div className='task_form-input-ctn'>
                <Select
                    formRegisterType='entity_responsible'
                    options={entityOptions}
                    register={register}
                // {...register('entity_responsible')}
                />
            </div>
            <button
                className='task_form-submit-btn'
                type='submit'
            >
                {addTemplateEvent.isLoading
                    ? <Spinner />
                    : <FontAwesomeIcon icon={faPlusSquare} size='2x' />}
            </button>

        </form>
    )
}

export default CreateTaskFormRefactor