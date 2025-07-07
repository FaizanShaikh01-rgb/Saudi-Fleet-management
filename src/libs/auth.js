// Third-party Imports
import CredentialProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialProvider({
      name: 'Credentials',
      type: 'credentials',

      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials

        // ✅ Use static demo logic
        if (email === 'admin@materialize.com' && password === 'admin') {
          return { id: 1, name: 'Admin', email: 'admin@materialize.com' }
        }

        return null
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },

  pages: {
    signIn: '/login'
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name
      }
      return session
    }
  },

  secret: process.env.NEXTAUTH_SECRET
}
