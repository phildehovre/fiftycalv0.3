import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../App'
import { entityOptions, typeOptions } from '../assets/selectOptions'
import './EventSlice.scss'
import { formatAndUpdateEvent } from '../apis/googleCalendar'
import { useSession } from '@supabase/auth-helpers-react'
import { useTemplate } from '../util/db'

function EventCellRefactor(props: {
    value: string | number | undefined
    units?: string | undefined,
    eventId: string,
    type: string,
    eventKey: string,
    dataTable: string,
    targetDate: any
}) {


    const {
        value,
        eventId,
        type,
        eventKey,
        dataTable,
        targetDate
    } = props

    const [edit, setEdit] = React.useState(false)
    const [isHovered, setIsHovered] = React.useState(false)

    const queryClient = useQueryClient()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const session = useSession()


    const cellRef: React.MutableRefObject<any> = useRef()

    useEffect(() => {
        window.addEventListener('click', (e) => {
            try {

                if (cellRef.current !== null && !cellRef.current.contains(e.target)) {
                    setEdit(false)
                }
            }
            catch (err) {
                console.log(err)
            }
        })
    }, [])

    const styles: any = () => {
        if (eventKey === 'entity_responsible') {
            let match: { type: string, color: string } | undefined = entityOptions.find((option, i) => {
                return option.type == value
            })

            return { backgroundColor: match?.color }
        }
        if (eventKey === 'type') {
            let match: { type: string, color: string } | undefined = typeOptions.find((option, i) => {
                return option.type == value
            })

            return { backgroundColor: match?.color }
        }
    }


    const handleCellClick = () => {
        setEdit(true)
    }

    const updateCellFn = async ({ id, key, val }: any) => {
        return await supabase
            .from(dataTable)
            .update({ [key]: val })
            .eq('id', id)
            .select()
    }

    const updateCell = useMutation({
        mutationFn: ({ id, key, val }: any) => updateCellFn({ id, key, val }),
        // onMutate: (res) => console.log(res)
    })

    const onSubmit = (formData: any) => {
        let keys = Object.keys(formData)
        let key = keys[0]
        let value = formData[key]
        updateCell.mutateAsync({ id: eventId, key: key, val: value }).then((res: any) => {
            formatAndUpdateEvent(res.data[0], targetDate, session)
            queryClient.invalidateQueries({ queryKey: [dataTable] })
            setEdit(false)
        }
        )
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} ref={cellRef}
                onMouseEnter={() => { setIsHovered(true) }}
                onMouseLeave={() => { setIsHovered(false) }}
                onDoubleClick={() => setEdit(true)}
                className={`event_cell-ctn`}
                style={styles()}>
                {/* {
                    isHovered &&
                    <button className='event_cell-btn' onClick={() => { handleCellClick() }}><FontAwesomeIcon icon={faPencil} /></button>
                } */}
                {edit
                    ? <input type={type}
                        defaultValue={value}
                        {...register(eventKey)}
                    ></input>
                    : eventKey === 'completed'
                        ? <input type='checkbox'
                            {...register('completed')}
                            defaultValue={value}></input>
                        : <div>{value}</div>
                }
            </form >
        </>
    )
}

export default EventCellRefactor