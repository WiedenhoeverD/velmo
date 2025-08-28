import { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
    interface Session extends DefaultSession {
        accessToken?: string
        expiresAt?: number
        refreshToken?: string
        user: DefaultUser
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        accessToken?: string
        expiresAt?: number
        refreshToken?: string
    }
}
