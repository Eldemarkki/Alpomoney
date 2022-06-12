import { PrismaClient } from "@prisma/client";
import { NextApiHandler } from "next";
import { getAllStorages } from "../../lib/storages";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    const storages = getAllStorages();
    res.status(200).json(storages);
  }
  else if (req.method === "POST") {
    const { body } = req;

    if (!body.name) {
      return res.status(400).json({
        error: "Name is required"
      });
    }

    if (!body.userId) {
      return res.status(400).json({
        error: "UserId is required"
      });
    }

    const prisma = new PrismaClient();
    const storage = await prisma.storage.create({
      data: {
        name: body.name,
        userId: body.userId
      }
    })

    res.status(200).json(storage);
  }
  else {
    res.status(405).send(null);
  }
};

export default handler;