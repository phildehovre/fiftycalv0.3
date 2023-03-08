import React from 'react'
import './Section.scss'

function Section(props: {
    children: React.ReactNode
    flexDirection?: string | undefined
    display?: string
    height?: string
    bkg?: string
    centered?: boolean

}) {

    const { flexDirection, display, height, bkg, centered } = props

    const styles: object = {
        flexDirection: flexDirection,
        display: display,
        height: height,
        backgroundColor: `var(${bkg}`,
    }


    return (
        <div
            className={`section-ctn ${centered ? 'centered' : ''}`}
            style={styles} > {props.children}</div>
    )
}

export default Section