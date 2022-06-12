import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { getAllStorages } from "../../lib/storages";
import { sessionSettings } from "../../sessions/ironSessionSettings";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    const storages = getAllStorages();
    res.status(200).json(storages);
  }
  else if (req.method === "POST") {
    const { body } = req;

    if (!req.session.user) {
      res.status(401).json({ error: "You must be logged in to create a storage" });
      return;
    }

    if (!body.name) {
      return res.status(400).json({
        error: "Name is required"
      });
    }

    const prisma = new PrismaClient();
    const storage = await prisma.storage.create({
      data: {
        name: body.name,
        userId: req.session.user.id
      }
    })

    res.status(200).json(storage);
  }
  else {
    res.status(405).send(null);
  }
};

export default withIronSessionApiRoute(handler, sessionSettings);