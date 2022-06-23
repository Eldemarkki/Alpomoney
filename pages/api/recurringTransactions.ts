import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { hasKey, isRecurringTransactionFrequency, isValidDate } from "../../utils/types";

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
    if (!req.session.user) {
      res.status(401).json({ error: "You must be logged in to create a recurring transaction" });
      return;
    }

    if (!hasKey(req.body, "name")) {
      return res.status(400).json({ error: "Missing name" });
    }
    if (typeof req.body.name !== "string") {
      return res.status(400).json({ error: "Name must be a string" });
    }
    if (!hasKey(req.body, "amount")) {
      return res.status(400).json({ error: "Missing amount" });
    }
    if (typeof req.body.amount !== "number") {
      return res.status(400).json({ error: "Amount must be a number" });
    }
    if (!hasKey(req.body, "sinkId")) {
      return res.status(400).json({ error: "Missing sinkId" });
    }
    if (typeof req.body.sinkId !== "string") {
      return res.status(400).json({ error: "sinkId must be a string" });
    }
    if (!hasKey(req.body, "storageId")) {
      return res.status(400).json({ error: "Missing storageId" });
    }
    if (typeof req.body.storageId !== "string") {
      return res.status(400).json({ error: "storageId must be a string" });
    }
    if (!hasKey(req.body, "frequency")) {
      return res.status(400).json({ error: "Missing frequency" });
    }
    if (!isRecurringTransactionFrequency(req.body.frequency)) {
      return res.status(400).json({ error: "Frequency must be one of: daily, weekly, monthly, yearly" });
    }
    if (!hasKey(req.body, "category")) {
      return res.status(400).json({ error: "Missing category" });
    }
    if (typeof req.body.category !== "string") {
      return res.status(400).json({ error: "Category must be a string" });
    }
    if (!hasKey(req.body, "startDate")) {
      return res.status(400).json({ error: "Missing startDate" });
    }
    if (typeof req.body.startDate !== "string") {
      return res.status(400).json({ error: "startDate must be a string" });
    }
    if (!isValidDate(req.body.startDate)) {
      return res.status(400).json({ error: "startDate must be a valid date" });
    }

    const prisma = new PrismaClient();

    const recurringTransaction = await prisma.recurringTransaction.create({
      data: {
        amount: req.body.amount,
        name: req.body.name,
        frequency: req.body.frequency,
        sinkId: req.body.sinkId,
        storageId: req.body.storageId,
        category: req.body.category,
        userId: req.session.user.id,
        startDate: new Date(req.body.startDate)
      }
    });

    res.status(200).json(recurringTransaction);
  }
  else {
    res.status(405).send(null);
  }
};

export default withIronSessionApiRoute(handler, sessionSettings);
