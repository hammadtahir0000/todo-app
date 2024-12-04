// app/api/auth/register/route.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Handle the POST request for registration
export async function POST(req: NextRequest) {
     try {
          // Parse the incoming JSON body
          const { email, password, name } = await req.json();

          // Validate that all fields are provided
          if (!email || !password || !name) {
               return NextResponse.json(
                    { error: 'All fields are required' },
                    { status: 400 }
               );
          }

          // Hash the password before storing it in the database
          const hashedPassword = await bcrypt.hash(password, 10);

          // Create a new user in the database
          const user = await prisma.user.create({
               data: {
                    email,
                    password: hashedPassword,
                    name,
               },
          });

          // Respond with a success message and the user data
          return NextResponse.json({ message: 'User created', user });
     } catch (error) {
          console.error('Error creating user:', error);
          return NextResponse.json(
               { error: 'Error creating user' },
               { status: 500 }
          );
     }
}
