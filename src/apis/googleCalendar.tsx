import { supabase } from '../App';
import dayjs from 'dayjs'
import { useQuery, QueryFunctionContext } from '@tanstack/react-query'

export async function deleteCalendarEvent(id: string, session: any) {
    try {
        await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}`, {
            method: 'DELETE',
            headers: {
                // @ts-ignore
                'Authorization': 'Bearer ' + session.provider_token
            },
        }).then((data) => {
            console.log(JSON.stringify(data))
        })
    } catch (error) {
        alert('Unable to delete event at this time: ' + error)
    }
}

export async function formatAndUpdateEvent(eventObj: {
    category: string,
    completed: boolean,
    description: string
    position: number,
    id: string,
    type: string,
    event_id: string
}, targetDate: Date,

    // ===== PASS THE USER SESSION AS SECOND PARAMETER:
    session: any) {

    const { category,
        completed,
        description,
        position,
        id,
        type,
        event_id
    } = eventObj

    const start = dayjs(targetDate).subtract(position, 'days')
    const end = dayjs(targetDate).subtract(position, 'days').add(1, 'hour')


    const event = {
        'summary': description,
        'description': `${category} / ${type}`,
        'start': {
            'dateTime': start.toISOString(),
            'timezone': Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        'end': {
            'dateTime': end.toISOString(),
            'timezone': Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        'id': event_id
    }

    try {
        await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${event_id}`, {
            method: 'PUT',
            headers: {
                // @ts-ignore
                'Authorization': 'Bearer ' + session.provider_token
            },
            body: JSON.stringify(event)
        }).then((data) => {
            console.log(data)
            return data.json();
        });
    } catch (error) {
        alert('Unable to create event at this time: ' + error)
    }
}


const fetchHolidays = async (region: string, session: any) => {
    const BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAYS = "holiday@group.v.calendar.google.com"
    const CALENDAR_REGION = region
    try {
        const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_REGION}%23${BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAYS}/events`, {
            method: 'GET',
            headers: {
                // @ts-ignore
                'Authorization': 'Bearer ' + session.provider_token
            },

        }
        );
        return res.json()
    }
    catch (err) {
        console.log(err)
    }
}


export function useHolidays(region: any, session: any) {
    return useQuery(
        ['holidays', { region }], () => fetchHolidays(region, session),
    )
};