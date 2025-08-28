# Velmo
Velmo helps you keep track of your finances effortlessly. Manage your incoming and outgoing money across all your bank accounts in one place, gain clear insights into your spending, and take control of your financial life. Simple, secure, and designed to make money management stress-free.

# setup
Velmo uses for login authentik sso. It is possible to adapt to other sso provider.
## pre setup
edit the postgres login inside sea-orm.sh

## setup
1. Start DB (Docker compose)
2. Sea-orm types -> run sea-orm.sh

# env
## backend
```
AUTHENTIK_CLIENT_ID=
POSTGRES_URL=
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