import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { sessionSettings } from "../../sessions/ironSessionSettings";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const { body } = req;

    if (!req.session.user) {
      res.status(401).json({ error: "You must be logged in to create a transaction" });
      return;
    }

    if (body.amount === undefined) return res.status(400).json({ error: "Amount is required" });
    if (!body.sinkId) return res.status(400).json({ error: "SinkId is required" });
    if (!body.storageId) return res.status(400).json({ error: "StorageId is required" });

    const prisma = new PrismaClient();
    const transaction = await prisma.transaction.create({
      data: {
        amount: body.amount,
        description: body.description ?? undefined,
        sinkId: body.sinkId,
        storageId: body.storageId,
        userId: req.session.user.id
      }
    })

    res.status(200).json(transaction);
  }
  else {
    res.status(405).send(null);
  }
};

export default withIronSessionApiRoute(handler, sessionSettings);