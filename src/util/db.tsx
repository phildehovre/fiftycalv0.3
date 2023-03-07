//@ts-nocheck

import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '../App';
import dayjs from 'dayjs'
import { backOff } from 'exponential-backoff';




const fetchTemplate = async (id: string) => {
    try {
        const res = await supabase
            .from('templates')
            .select()
            .eq('template_id', id)
            .single()
        return res
    }

    catch (error) {
        console.log(error)
    }

    finally {
    }
};

export function useTemplate(id: string) {
    return useQuery(
        ['template', { id }], () => fetchTemplate(id),
        {
            enabled: !!id
        }
    )
};
const fetchCampaign = async (id: string) => {
    try {
        const res = await supabase
            .from('campaigns')
            .select()
            .eq('campaign_id', id)
            .single()
        return res
    }

    catch (error) {
        console.log(error)
    }

    finally {
    }
};

export function useCampaign(id: string | undefined) {
    return useQuery(
        ['campaign', { id }], () => fetchCampaign(id),
        {
            enabled: !!id
        }
    )
};


async function fetchTemplates() {
    let res = await supabase
        .from('templates')
        .select('*')
    return res
};

export function useTemplates() {
    return useQuery(
        ['templates'],
        () => fetchTemplates()
    )
};

async function fetchTemplateEvents(templateId: string) {
    let res = await supabase
        .from('template_events')
        .select('*')
        .eq('template_id', templateId)
    return res
};

export function useTemplateEvents(id: string) {
    return useQuery(
        ['template_events', id],
        () => fetchTemplateEvents(id)
    )
};

async function fetchCampaignEvents(id: string) {
    let res = await supabase
        .from('campaign_events')
        .select('*')
        .eq('campaign_id', id)
    return res
};

export function useCampaignEvents(id: any) {
    return useQuery(
        ['campaign_events', id],
        () => fetchCampaignEvents(id),
        {
            enabled: !!id
        }
    )
};

async function fetchCampaigns() {
    let res = await supabase
        .from('campaigns')
        .select('*')
    return res
};

export function useCampaigns() {
    return useQuery(
        ['campaigns',],
        () => fetchCampaigns(),
    );
};

export const deleteEvents = async (campaign_id: string) => await supabase
    .from('campaign_events')
    .delete()
    .eq('campaign_id', campaign_id);

export const deleteCampaign = async (campaign_id: string) => await supabase
    .from('campaigns')
    .delete()
    .eq('campaign_id', campaign_id)


export async function postEvents(events: any[], targetDate: Date, session: any) {
    for (let i = 0; i < events.length; i++) {
        try {
            const response = await backOff(() => formatAndPostEvent(events[i], targetDate, session))
            return response
                .then((res) => console.log(res))
        } catch (e) {
            console.log('error: ', e)
        }
    }
}

async function formatAndPostEvent(eventObj: {
    category: string,
    completed: boolean,
    description: string
    position: number,
    id: string,
    type: string,
    event_id: string
}, targetDate: Date, session: any) {

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
        await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'POST',
            headers: {
                // @ts-ignore
                'Authorization': 'Bearer ' + session.provider_token
            },
            body: JSON.stringify(event)
        }).then((res) => {
            console.log()
            return res.json()
        })
    } catch (error) {
        alert('Unable to create event at this time: ' + error)
    }
}

