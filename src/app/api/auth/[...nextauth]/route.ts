// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

// Initialize Prisma Client
const prisma = new PrismaClient();

const authOptions = {
     providers: [
          GoogleProvider({
               clientId: process.env.GOOGLE_CLIENT_ID!,
               clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),

          CredentialsProvider({
               name: "Credentials",
               credentials: {
                    email: { label: "Email", type: "email" },
                    password: { label: "Password", type: "password" },
               },
               authorize: async (credentials) => {
                    if (!credentials?.email || !credentials?.password) {
                         return null; // Handle missing credentials
                    }

                    // Check if the user exists in the database
                    const user = await prisma.user.findUnique({
                         where: { email: credentials.email },
                    });

                    if (!user) {
                         return null; // No user found
                    }

                    // Compare password
                    const isValid = await bcrypt.compare(credentials.password, (user?.password || ""));
                    if (!isValid) {
                         return null; // Invalid password
                    }

                    return { id: user.id, email: user.email, name: user.name };
               },
          }),
     ],

     callbacks: {
          async jwt({ token, user }: { token: any; user: any }) {
               if (user) {
                    token.id = user.id;
                    token.email = user.email;
                    token.name = user.name || null;
               }
               return token;
          },
          async session({ session, token }: { session: any; token: any }) {
               if (token) {
                    session.user = {
                         email: token.email as string,
                         name: token.name as string,
                         id: token.id as string,
                    };
               }
               return session;
          },
     },
     pages: {
          signIn: "/", // Sign-in page
     },
};

// Export named HTTP methods (required by App Router)
export async function GET(req: NextApiRequest, res: NextApiResponse) {
     return NextAuth(req, res, authOptions); // Pass NextRequest and NextResponse
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
     return NextAuth(req, res, authOptions); // Pass NextRequest and NextResponse
}
