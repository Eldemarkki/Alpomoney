import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { hasKey } from "../../utils/types";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    const prisma = new PrismaClient();
    const storages = await prisma.storage.findMany({});

    res.status(200).json(storages);
  }
  else if (req.method === "POST") {
    if (!req.session.user) {
      res.status(401).json({ error: "You must be logged in to create a storage" });
      return;
    }

    if (!hasKey(req.body, "name")) {
      return res.status(400).json({ error: "Missing name" });
    }
    if (typeof req.body.name !== "string") {
      return res.status(400).json({ error: "Name must be a string" });
    }

    let startAmount = 0;
    if (hasKey(req.body, "startAmount")) {
      if (typeof req.body.startAmount !== "number") {
        return res.status(400).json({ error: "startAmount must be a number" });
      }
      startAmount = req.body.startAmount;
    }

    const prisma = new PrismaClient();
    const storage = await prisma.storage.create({
      data: {
        name: req.body.name,
        userId: req.session.user.id,
        startAmount
      }
    });

    res.status(200).json(storage);
  }
  else {
    res.status(405).send(null);
  }
};

export default withIronSessionApiRoute(handler, sessionSettings);
