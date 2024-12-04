import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../../lib/prisma";

const getTasks = async (req: NextApiRequest, res: NextApiResponse) => {
     if (req.method === "GET") {
          const session = await getSession({ req });

          // Ensure the user is authenticated and has a valid email
          if (!session || !session.user?.email) {
               return res.status(401).json({ message: "Unauthorized" });
          }

          try {
               const tasks = await prisma.task.findMany({
                    where: {
                         user: { email: session.user.email }, // Safe to access email after null check
                    },
               });
               return res.status(200).json(tasks); // Return the list of tasks
          } catch (error) {
               return res.status(500).json({ message: "Error fetching tasks" });
          }
     } else {
          return res.status(405).json({ message: "Method Not Allowed" });
     }
};

export default getTasks;
