import React, { useEffect, useState } from 'react'
import { CampaignObj } from '../types/types'
import { useParams } from 'react-router'

export const selectedCampaignContext = React.createContext<SelectedCampaignType | undefined>(undefined)

export type SelectedCampaignType = {
    selectedCampaignId: string | undefined
    setSelectedCampaignId: React.Dispatch<React.SetStateAction<string | undefined>>
}


function SelectedCampaignContextProvider(props: { children: React.ReactNode }) {

    const params = useParams()
    console.log(params)


    const [selectedCampaignId, setSelectedCampaignId] = useState<string | undefined>(undefined)

    return (
        <selectedCampaignContext.Provider
            value={{ selectedCampaignId, setSelectedCampaignId }}
        >
            {props.children}
        </selectedCampaignContext.Provider>
    )
}

export default SelectedCampaignContextProvider