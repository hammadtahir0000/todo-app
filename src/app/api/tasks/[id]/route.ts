import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../../../lib/prisma";


const taskHandler = async (req: NextApiRequest, res: NextApiResponse) => {
     const { id } = req.query;

     if (req.method === "DELETE") {
          const session = await getSession({ req });
          if (!session) {
               return res.status(401).json({ message: "Unauthorized" });
          }

          try {
               const task = await prisma.task.delete({
                    where: { id: id as string },
               });
               return res.status(200).json(task);
          } catch (error) {
               return res.status(500).json({ message: "Error deleting task" });
          }
     }

     if (req.method === "PUT") {
          const session = await getSession({ req });
          if (!session) {
               return res.status(401).json({ message: "Unauthorized" });
          }

          const { title } = req.body;
          if (!title) {
               return res.status(400).json({ message: "Title is required" });
          }

          try {
               const task = await prisma.task.update({
                    where: { id: id as string },
                    data: { title },
               });
               return res.status(200).json(task);
          } catch (error) {
               return res.status(500).json({ message: "Error updating task" });
          }
     }

     return res.status(405).json({ message: "Method Not Allowed" });
};

export default taskHandler;
