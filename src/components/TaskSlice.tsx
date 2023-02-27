//@ts-nocheck

import React from 'react'
import { TaskObj, TemplateObj } from '../types/types'
import CreateTaskForm from './CreateTaskForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faPlusSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import Spinner from './Spinner'
import { useMutation } from '@tanstack/react-query'
import { supabase } from '../App'
import { useQueryClient } from '@tanstack/react-query'
import { convertDaysToUnits } from '../utils/helpers'


function TaskSlice(props: any) {

    const {
        template,
        task,
        taskIndex,
        indexOfEdited,
        setIndexOfEdited,
        setIsCreatingTask
    } = props



    const [isHovered, setIsHovered] = React.useState(false)

    const queryClient = useQueryClient()

    const deleteTemplateEvent = useMutation({
        mutationFn: async (task: TaskObj) => await supabase
            .from('template_events')
            .delete()
            .eq('id', task.id)
    });


    const handleDeleteTask = (task: TaskObj) => {
        deleteTemplateEvent.mutateAsync(task).then((res) => {
            queryClient.invalidateQueries({ queryKey: ['template_events'] })
        }
        )
    }

    const renderCreateTaskButton = () => {
        if (props.type == 'edit') {
            return (
                <CreateTaskForm setIndexOfEdited={setIndexOfEdited} />
            )
        }
        if (props.type == 'create') {
            return (
                <CreateTaskForm type='create' setIsCreatingTask={setIsCreatingTask} />
            )
        }
        if (props.type == 'placeholder') {
            return (
                <Spinner />
            )
        }



        return (
            <>
                {indexOfEdited === taskIndex
                    ? <CreateTaskForm type='edit' task={task} />
                    : <div className='slice-ctn'
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div className='slice-cell' >{convertDaysToUnits(task?.position, task?.position_units)} {task?.position_units} before</div>
                        <div className='slice-cell' >{task?.category}</div>
                        <div className='slice-cell' >{task?.description}</div>
                        <div className='slice-cell' >{task?.entity_responsible}</div>
                        <div className='slice-cell' >{task?.type}</div>

                        {isHovered &&
                            <span className='edit_delete-ctn'>
                                <button className='' ><FontAwesomeIcon icon={faTrash}
                                    onClick={() => { handleDeleteTask(task) }}
                                /></button>
                                <button
                                    onClick={() => { setIndexOfEdited(taskIndex) }}
                                ><FontAwesomeIcon icon={faPencil} /></button>
                            </span>
                        }
                    </div >
                }
            </>
        )
    }

    return (
        <>
            {renderCreateTaskButton()}
        </>
    )

}


export default TaskSlice