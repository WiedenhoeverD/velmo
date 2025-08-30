import axios, { AxiosRequestConfig } from 'axios'
import { getSession } from 'next-auth/react'

export const customAxios = async <T>(
    config: AxiosRequestConfig
): Promise<T> => {
    const session = await getSession()
    const instance = axios.create({
        baseURL: 'http://localhost:8080',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.accessToken ?? ''}`,
        },
    })

    return instance.request<T>(config).then((res) => res.data)
}
