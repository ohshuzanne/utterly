import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { prisma } from "@/lib/prisma";

// adds a type for user object with password
type UserWithPassword = {
  id: string;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  position: string | null;
  company: string | null;
  accountPurpose: string | null;
  experienceLevel: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // uses raw query to avoid TypeScript issues with the password field
        const users = await prisma.$queryRaw<UserWithPassword[]>`
          SELECT * FROM "User" WHERE email = ${credentials.email} LIMIT 1
        `;
        
        const user = users.length > 0 ? users[0] : null;

        if (!user || !user.password) {
          return null;
        }

        const passwordValid = await compare(credentials.password, user.password);

        if (!passwordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    newUser: "/dashboard"
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 