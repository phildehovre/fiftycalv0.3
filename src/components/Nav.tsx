import React from 'react'
import SupabaseLogin from './SupabaseLogin'
import SupabaseSignOut from './SupabaseSignOut'
import { Link } from 'react-router-dom'
import { Session, useSession } from '@supabase/auth-helpers-react'
import CreateTemplatePage from '../pages/CreateTemplatePage'
import './Nav.scss'



function Nav() {

    const session: any = useSession()

    return (
        <div className='nav-ctn'>
            <div className='logo'>FC</div>
            <div className='links-ctn'>
                <Link to='/'>Home</Link>

                {session
                    ? <>
                        <Link to='/template'>New template</Link>
                        <Link to='/campaign'>New Campaign</Link>
                        <SupabaseSignOut />
                        <div className='user-icon'>
                            {

                                session?.user.email[0].toUpperCase()
                            }</div>
                    </>
                    : <SupabaseLogin />
                }
            </div>
        </div>
    )
}

export default Nav