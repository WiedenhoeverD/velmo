# Velmo
Velmo helps you keep track of your finances effortlessly. Manage your incoming and outgoing money across all your bank accounts in one place, gain clear insights into your spending, and take control of your financial life. Simple, secure, and designed to make money management stress-free.

# setup
Velmo uses for login authentik sso. It is possible to adapt to other sso provider.
## pre setup
edit the postgres login inside sea-orm.sh
## Authentik
To use the Avatar from Authentik, we need to ensure that NextAuth retrieves the avatar.
Inside Authentik Admin Panel go to Customization -> Property Mappings and create a Scope Mapping with:  
Scope name `profile`  
Expression:
``` python
return {
  "picture": request.user.avatar
}
```

## setup
1. Start DB (Docker compose)
2. Sea-orm types -> run sea-orm.sh
3. frontend types -> run npx orval

# env
## backend
```
AUTHENTIK_CLIENT_ID=
POSTGRES_URL=
AUTHENTIK_JWKS_URL=
```
## frontend
```
AUTHENTIK_CLIENT_ID=
AUTHENTIK_CLIENT_SECRET=
AUTHENTIK_URL=
AUTHENTIK_ISSUER=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
BACKEND_URL=
```