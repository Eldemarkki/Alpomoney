import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { getOptionalValue, getValue, requireAuthentication } from "../../utils/apiUtils";
import { numberValidator, stringValidator, uuidValidator } from "../../utils/apiValidators";
import { withApiErrorHandling } from "../../utils/errorHandling";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    requireAuthentication(req, "You must be logged in to create a transaction");

    // TODO: Check that the user has access to this transaction, sink, and storage
    const amount = getValue(req.body, "amount", numberValidator);
    const sinkId = getValue(req.body, "sinkId", uuidValidator);
    const description = getOptionalValue(req.body, "description", stringValidator);
    const storageId = getValue(req.body, "storageId", uuidValidator);

    const prisma = new PrismaClient();
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        description,
        sinkId,
        storageId,
        userId: req.session.user.id
      }
    });

    res.json(transaction);
  }
  else {
    res.status(405).send(null);
  }
};

export default withApiErrorHandling(withIronSessionApiRoute(handler, sessionSettings));
