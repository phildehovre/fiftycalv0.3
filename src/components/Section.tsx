import React from 'react'
import './Section.scss'

function Section(props: {
    children: React.ReactNode
    flexDirection?: string | undefined
    display?: string
    height?: string
    bkg?: string

}) {

    const { flexDirection, display, height, bkg } = props

    const styles: object = {
        flexDirection: flexDirection,
        display: display,
        height: height,
        backgroundColor: `var(${bkg}`,
    }


    return (
        <div className='section-ctn' style={styles} > {props.children}</div>
    )
}

export default Section