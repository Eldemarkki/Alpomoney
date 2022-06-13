import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { sessionSettings } from "../../sessions/ironSessionSettings";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    if (!req.session.user) {
      res.status(401).json({ error: "You must be logged in to create a recurring transaction" });
      return;
    }

    const prisma = new PrismaClient();

    const transactions = await prisma.recurringTransaction.findMany({
      where: {
        userId: req.session.user.id
      }
    });

    return res.json(transactions);
  }
  else if (req.method === "POST") {
    const { body } = req;

    if (!req.session.user) {
      res.status(401).json({ error: "You must be logged in to create a recurring transaction" });
      return;
    }

    if (body.amount === undefined) return res.status(400).json({ error: "Amount is required" });
    if (!body.name) return res.status(400).json({ error: "Name is required" });
    if (!body.frequency) return res.status(400).json({ error: "Frequency is required" });
    if (!body.sinkId) return res.status(400).json({ error: "SinkId is required" });
    if (!body.storageId) return res.status(400).json({ error: "StorageId is required" });

    const prisma = new PrismaClient();

    const recurringTransaction = await prisma.recurringTransaction.create({
      data: {
        amount: body.amount,
        name: body.name,
        frequency: body.frequency,
        sinkId: body.sinkId,
        storageId: body.storageId,
        category: body.category,
        userId: req.session.user.id,
      }
    })

    res.status(200).json(recurringTransaction);
  }
  else {
    res.status(405).send(null);
  }
};

export default withIronSessionApiRoute(handler, sessionSettings);