'use client'

import React, {createContext, useContext, useEffect, useState} from 'react'

type BreadcrumbItem = {
    label: string
    href?: string
}

type BreadcrumbContextType = {
    breadcrumbs: BreadcrumbItem[]
    setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined)

export function BreadcrumbProvider({children}: { children: React.ReactNode }) {
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])

    return (
        <BreadcrumbContext.Provider value={{breadcrumbs, setBreadcrumbs}}>
            {children}
        </BreadcrumbContext.Provider>
    )
}

export function useBreadcrumbs() {
    const context = useContext(BreadcrumbContext)
    if (!context) {
        throw new Error('useBreadcrumbs must be used within BreadcrumbProvider')
    }
    return context
}

export function SetBreadcrumbs({items}: { items: BreadcrumbItem[] }) {
    const {setBreadcrumbs} = useBreadcrumbs()

    useEffect(() => {
        setBreadcrumbs(items)
    }, [items, setBreadcrumbs])

    return null
}