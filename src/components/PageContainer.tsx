import React from 'react'

function PageContainer(props: { children: React.ReactNode }) {
    return (
        <div className='page_container'>
            {props.children}
        </div>
    )
}

export default PageContainer