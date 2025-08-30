import refreshAccessToken from '@/utils/next-auth/refreshToken'
import NextAuth from 'next-auth/next'
import Authentik from 'next-auth/providers/authentik'

const handler = NextAuth({
    providers: [
        Authentik({
            clientId: process.env.AUTHENTIK_CLIENT_ID ?? '',
            clientSecret: process.env.AUTHENTIK_CLIENT_SECRET ?? '',
            issuer: process.env.AUTHENTIK_ISSUER,
            authorization: {
                params: {
                    scope: 'openid profile email offline_access',
                },
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, account, user }) {
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    accessTokenExpires: (account.expires_at as number) * 1000,
                    refreshToken: account.refresh_token,
                }
            }
            if (
                token.accessTokenExpires &&
                Date.now() < token.accessTokenExpires
            ) {
                console.log(
                    'Access token is still valid for',
                    (token.accessTokenExpires - Date.now()) / 1000,
                    'seconds'
                )
                return token
            }
            if (!token.refreshToken)
                return { ...token, error: 'refresh_access_token_error' }
            try {
                console.log('renew')
                const newToken = await refreshAccessToken(token)
                console.log(
                    'Access token is still valid for',
                    (newToken.accessTokenExpires ?? 0 - Date.now()) / 1000,
                    'seconds'
                )
                return newToken
            } catch (error) {
                console.error('Error refreshing access token:', error)
                return {
                    ...token,
                    error: 'refresh_access_token_error',
                }
            }
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken
            session.accessTokenExpires = token.accessTokenExpires
            session.error = token.error

            return session
        },
        async signIn({ account, profile }) {
            try {
                const res = await fetch(
                    `${process.env.BACKEND_URL}/user/exists`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${account?.access_token}`,
                        },
                    }
                )

                if (res.ok) return true

                if (!res.ok) {
                    const res = await fetch(
                        `${process.env.BACKEND_URL}/user/create`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${account?.access_token}`,
                            },
                            body: JSON.stringify({
                                email: profile?.email,
                                name: profile?.name,
                            }),
                        }
                    )
                    if (res.ok) return true
                    return false
                }

                return false
            } catch (error) {
                console.error('Error:', error)
                return false
            }
        },
    },
})

export { handler as GET, handler as POST }
