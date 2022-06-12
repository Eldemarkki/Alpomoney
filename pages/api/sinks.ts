import { PrismaClient } from "@prisma/client";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    const prisma = new PrismaClient();
    const sinks = await prisma.sink.findMany({});
    res.status(200).json(sinks);
  }
  else if (req.method === "POST") {
    const { body } = req;

    if (!body.name) {
      return res.status(400).json({
        error: "Name is required"
      });
    }

    const prisma = new PrismaClient();
    const sink = await prisma.sink.create({
      data: {
        name: body.name,
      }
    })

    res.status(200).json(sink);
  }
  else {
    res.status(405).send(null);
  }
};

export default handler;