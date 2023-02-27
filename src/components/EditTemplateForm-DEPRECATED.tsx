
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import TaskSlice from './TaskSlice'
import { TaskObj, TemplateObj } from '../types/types'
import { useTemplateEvents } from '../util/db'
import ColumnHeaders from './ColumnHeaders'
import './Table.scss'



function EditTemplateForm(props: {
    template: TemplateObj
}) {

    const [isCreatingTask, setIsCreatingTask] = useState<any>(false)
    const [indexOfEdited, setIndexOfEdited] = React.useState<any>(null)

    const { template } = props

    const {
        data: templateEventsData,
        isLoading: isTemplateEventsLoading,
        error: templateEventsError
    }: any = useTemplateEvents(template.template_id)


    const renderTemplateEvents = () => {
        let templatesSorted = templateEventsData?.data?.sort((a: any, b: any) => { return b.position - a.position })
        return templatesSorted?.map((e: object, i: number) => {
            return (
                <TaskSlice
                    task={e}
                    key={i}
                    template={template}
                    type={'data'}
                    taskIndex={i}
                    indexOfEdited={indexOfEdited}
                    setIndexOfEdited={setIndexOfEdited}
                    setIscreatingTask={setIsCreatingTask}
                />
            )
        })
    }


    return (
        <>
            <div className='template_flex-ctn'>
                <>{

                    templateEventsData?.data.length === 0 && !isCreatingTask &&
                    <h4>Add the first task</h4>
                }
                    {
                        isTemplateEventsLoading

                            ? <TaskSlice
                                task={templateEventsData?.data[indexOfEdited]}
                                template={template}
                                type='placeholder' />
                            : renderTemplateEvents()
                    }
                    {
                        isCreatingTask
                            ? <TaskSlice template={template} type='create'
                                setIscreatingTask={setIsCreatingTask}
                                setIndexOfEdited={setIndexOfEdited}
                            />
                            : <div className='add_task-btn'
                                onClick={() => setIsCreatingTask(true)}
                            >Add task<span><FontAwesomeIcon icon={faPlusCircle} size={'xl'} /></span></div>
                    }
                </>
            </div>
        </>
    )
}

export default EditTemplateForm