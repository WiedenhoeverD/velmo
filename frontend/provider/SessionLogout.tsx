'use client'

import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SessionLogout() {
    const { data: sessionData } = useSession()
    const router = useRouter()

    useEffect(() => {
        console.log('Session data:', sessionData)
        // check if the error has occurred
        if (sessionData && sessionData?.error === 'RefreshAccessTokenError') {
            signOut()
        }
    }, [sessionData, router])
    return null
}
