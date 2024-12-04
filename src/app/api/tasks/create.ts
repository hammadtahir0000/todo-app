import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../../lib/prisma";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
     const session = await getSession({ req });

     if (req.method === "POST") {
          // Handle POST for creating a task
          if (!session || !session.user?.email) {
               return res.status(401).json({ message: "Unauthorized" });
          }

          const { title } = req.body;
          if (!title) {
               return res.status(400).json({ message: "Title is required" });
          }

          try {
               const email = session.user.email;
               const task = await prisma.task.create({
                    data: {
                         title,
                         user: { connect: { email } },
                    },
               });
               return res.status(201).json(task);
          } catch (error) {
               return res.status(500).json({ message: "Error creating task" });
          }
     } else if (req.method === "GET") {
          // Handle GET for fetching tasks
          if (!session || !session.user?.email) {
               return res.status(401).json({ message: "Unauthorized" });
          }

          try {
               const email = session.user.email;
               const tasks = await prisma.task.findMany({
                    where: { user: { email } },
               });
               return res.status(200).json(tasks);
          } catch (error) {
               return res.status(500).json({ message: "Error fetching tasks" });
          }
     } else {
          return res.status(405).json({ message: "Method Not Allowed" });
     }
};

export default handler;
