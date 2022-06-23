import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { hasKey } from "../../utils/types";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    const prisma = new PrismaClient();
    const sinks = await prisma.sink.findMany({});
    res.status(200).json(sinks);
  }
  else if (req.method === "POST") {
    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ error: "Not logged in" });
    }

    if (!hasKey(req.body, "name")) {
      return res.status(400).json({ error: "Missing name" });
    }
    if (typeof req.body.name !== "string") {
      return res.status(400).json({ error: "Name must be a string" });
    }

    const prisma = new PrismaClient();
    const sink = await prisma.sink.create({
      data: {
        name: req.body.name,
        userId: user.id
      }
    });

    res.status(200).json(sink);
  }
  else {
    res.status(405).send(null);
  }
};

export default withIronSessionApiRoute(handler, sessionSettings);
