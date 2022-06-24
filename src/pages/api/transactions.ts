import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { hasKey } from "../../utils/types";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    if (!req.session.user) {
      res.status(401).json({ error: "You must be logged in to create a transaction" });
      return;
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

    const description =
      hasKey(req.body, "description") &&
        (typeof req.body.description === "string") ?
        req.body.description :
        undefined;

    const prisma = new PrismaClient();
    const transaction = await prisma.transaction.create({
      data: {
        amount: req.body.amount,
        description,
        sinkId: req.body.sinkId,
        storageId: req.body.storageId,
        userId: req.session.user.id
      }
    });

    res.status(200).json(transaction);
  }
  else {
    res.status(405).send(null);
  }
};

export default withIronSessionApiRoute(handler, sessionSettings);
