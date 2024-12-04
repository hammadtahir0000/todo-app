import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function registerUser(req: any, res: any) {
     if (req.method === 'POST') {
          const { email, password, name } = req.body;

          // Hash the password before storing it in the database
          const hashedPassword = await bcrypt.hash(password, 10);

          try {
               // Create a new user in the database
               const user = await prisma.user.create({
                    data: {
                         email,
                         password: hashedPassword,
                         name,
                    },
               });

               // Respond with the user object or success message
               res.status(200).json({ message: 'User created', user });
          } catch (error) {
               res.status(500).json({ error: 'Error creating user' });
          }
     } else {
          res.status(405).json({ error: 'Method Not Allowed' });
     }
}
