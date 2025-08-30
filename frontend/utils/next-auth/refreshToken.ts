import { JWT } from 'next-auth/jwt'

export default async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        const url = `${process.env.AUTHENTIK_URL}/application/o/token/`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: process.env.AUTHENTIK_CLIENT_ID ?? '',
                client_secret: process.env.AUTHENTIK_CLIENT_SECRET ?? '',
                refresh_token: token.refreshToken ?? '',
            }),
        })

        const refreshedTokens = await response.json()

        if (!response.ok) throw refreshedTokens
        console.log('OldToken', token.refreshToken)
        console.log('NewToken', refreshedTokens.refresh_token)
        console.log('Time left', refreshedTokens.expires_in, 'seconds')

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
        }
    } catch (error) {
        console.error('Error refreshing access token', error)
        return { ...token, error: 'RefreshAccessTokenError' }
    }
}
