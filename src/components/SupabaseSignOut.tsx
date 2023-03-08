import React from 'react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useNavigate } from 'react-router';




function SupabaseLogin() {

    const navigate = useNavigate()

    const session = useSession(); //tokens, when session exists, we have a user
    const supabase = useSupabaseClient(); // talk to supabase

    async function signOut() {
        await supabase.auth.signOut().then(() => {
            sessionStorage.clear()
            navigate('/')
        })
    }

    return (
        <button
            onClick={() => { signOut() }}>
            Sign out
        </button>
    )
}

export default SupabaseLogin