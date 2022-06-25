import { PrismaClient, Transaction } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { sessionSettings } from "../../../sessions/ironSessionSettings";
import { hasKey } from "../../../utils/types";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "DELETE") {
    const { id } = req.query;
    const prisma = new PrismaClient();
    await prisma.transaction.delete({
      where: {
        id: String(id)
      }
    });

    return res.status(200).json({ success: true });
  }
  if (req.method === "PUT") {
    const { id } = req.query;

    if (!req.session.user) {
      return res.status(401).json({ error: "You must be logged in to create a transaction" });
    }

    const editedTransaction: Partial<Transaction> = {};
    if (hasKey(req.body, "amount")) {
      if (typeof req.body.amount === "number") {
        editedTransaction.amount = req.body.amount;
      }
      else {
        return res.status(400).json({ error: "Amount must be a number" });
      }
    }

    if (hasKey(req.body, "description")) {
      if (typeof req.body.description === "string") {
        editedTransaction.description = req.body.description;
      }
      else {
        return res.status(400).json({ error: "Description must be a string" });
      }
    }

    if (hasKey(req.body, "sinkId")) {
      if (typeof req.body.sinkId === "string" || req.body.sinkId === null || req.body.sinkId === undefined) {
        // TODO: Check that the user has access to this sink
        editedTransaction.sinkId = req.body.sinkId;
      }
      else {
        return res.status(400).json({ error: "sinkId must be a string" });
      }
    }

    if (hasKey(req.body, "storageId")) {
      if (typeof req.body.storageId === "string") {
        editedTransaction.storageId = req.body.storageId;
      }
      else {
        return res.status(400).json({ error: "storageId must be a string" });
      }
    }

    const prisma = new PrismaClient();
    const newTransaction = await prisma.transaction.update({
      where: {
        id: String(id)
      },
      data: editedTransaction
    });

    return res.json(newTransaction);
  }
  else {
    res.status(405).send(null);
  }
};

export default withIronSessionApiRoute(handler, sessionSettings);
