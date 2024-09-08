import NextAuth from 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            email: string
            name: string
            token: stringg
        }
    }
    interface User {
        role: string
        token: string
    }
    interface Jwt {
        role: string
        token: string
    }
}