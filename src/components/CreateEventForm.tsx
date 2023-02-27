import React from 'react'
import { useState, useContext, useEffect } from 'react'
import DateTimePicker from 'react-datetime-picker'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { supabase } from '../App'
import { v4 as uuidv4 } from 'uuid'
// import { TemplateContext } from '../contexts/TemplateContext'



const schema = yup.object().shape({
    name: yup.string().required('Your first name is required'),
    description: yup.string().required('Your last name is required'),
    startDate: yup.date().default(() => (new Date())).required('A start date is required'),
    endDate: yup.date().default(() => (new Date())).required('A start date is required'),
})

function CreateEventForm() {

    console.log('is this still relevant')


    const [start, setStart] = useState(new Date())
    const [end, setEnd] = useState(new Date())
    const [eventName, setEventName] = useState('')
    const [eventDescription, setEventDescription] = useState('')

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })


    const session = useSession()
    // @ts-ignore
    // const { addEventToTemplate, createTemplate } = useContext(TemplateContext)
    const onSubmit = (event: any) => {
        console.log(event)
        addEvent.mutateAsync()
            .then(res => {
                console.log(res)
            }

            )
            .catch(err => console.log(err))
    }

    const createEvent = async () => {
        const event = {
            'id': uuidv4().toString().split('-').join(''),
            'summary': eventName,
            'description': eventDescription,
            'start': {
                'dateTime': start.toISOString(),
                'timezone': Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            'end': {
                'dateTime': end.toISOString(),
                'timezone': Intl.DateTimeFormat().resolvedOptions().timeZone
            },
        }

        try {
            await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                method: 'POST',
                headers: {
                    // @ts-ignore
                    'Authorization': 'Bearer ' + session.provider_token
                },
                body: JSON.stringify(event),
            })

                .then(
                    async (data) => {
                        await supabase
                            .from('events')
                            .insert(data)
                            .select()
                        console.log(data)

                    }
                ).then((data) => {
                    console.log(data)
                });
        } catch (error) {
            alert('Unable to create event at this time: ' + error)
        }

        await supabase
            .from('events')
            .insert(event)
            .select()
    }

    const addEvent = useMutation({
        mutationFn: createEvent
    })

    const getEvents = async () => {
        try {
            await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                method: 'GET',
                headers: {
                    // @ts-ignore
                    'Authorization': 'Bearer ' + session.provider_token
                },
            }).then((data) => {
                return data.json();
            }).then((data) => {
                console.log(data)
            });
        } catch (error) {
            alert('Unable to create event at this time: ' + error)
        }
    }

    useEffect(() => {
        // getEvents().then(res => console.log(res))
    }, [])



    return (
        <div>
            <h3>Create event: </h3>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', padding: '1em' }}>
                {/* <label className='form-error'>{errors.firstName?.message}</label> */}
                <label>Start date and time:</label>
                <DateTimePicker
                    {...register('startDate')}
                    value={start}
                    onChange={setStart}
                    name='startDate'
                />
                <label>End date and time:</label>
                <DateTimePicker
                    {...register('endDate')}
                    name='endDate'
                    value={end} onChange={setEnd} />
                <label>Name</label>
                <input
                    {...register('name')}
                    name='name'
                    type='text' value={eventName} onChange={(e) => { setEventName(e.target.value) }}></input>
                <label>Description</label>
                <input
                    {...register('description')}
                    name='description'
                    type='text' value={eventDescription} onChange={(e) => { setEventDescription(e.target.value) }}></input>
                <button
                    type='submit'
                >Create event</button>
            </form>
        </div>
    )
}

export default CreateEventForm