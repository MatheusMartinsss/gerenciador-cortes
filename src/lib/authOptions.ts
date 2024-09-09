import { authService } from "@/services/authService"
import NextAuth from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"


export const authOptions: NextAuthOptions = {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
          if (typeof credentials !== "undefined") {
            const res = await authService(credentials.email, credentials.password)
            if (typeof res != 'undefined') {
              return { ...res.user, token: res.token }
            } else {
              return null
            }
          } else {
            return null
          }
        }
      })
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.name = user.name,
            token.email = user.email
          token.name = user.name
          token.token = user.token
        }
        return token
      },
      async session({ session, token }) {
        session.user = token as any
        return session
      }
    },
    session: { strategy: "jwt" },
    pages: {
      signIn: '/auth'
    }
  }