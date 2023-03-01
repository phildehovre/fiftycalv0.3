import React, { useContext, useEffect } from 'react'
import { useCampaignEvents } from '../util/db'
import { v4 as uuid } from 'uuid'
import { useSession } from '@supabase/auth-helpers-react'
import { useHolidays } from '../apis/googleCalendar'


function Homepage() {


    return (
        <div>Homepage</div>
    )
}

export default Homepage