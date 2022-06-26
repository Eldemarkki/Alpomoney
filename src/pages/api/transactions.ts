import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import {
  getOptionalValue,
  getValue,
  requireAuthentication,
  requireResourceAccess,
  StatusCodes
} from "../../utils/apiUtils";
import { numberValidator, stringValidator, uuidValidator } from "../../utils/apiValidators";
import { withApiErrorHandling } from "../../utils/errorHandling";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    requireAuthentication(req, "You must be logged in to create a transaction");

    const amount = getValue(req.body, "amount", numberValidator);
    const sinkId = getValue(req.body, "sinkId", uuidValidator);
    const description = getOptionalValue(req.body, "description", stringValidator);
    const storageId = getValue(req.body, "storageId", uuidValidator);

    const prisma = new PrismaClient();

    await requireResourceAccess(req.session.user.id, sinkId, "sink", prisma);
    await requireResourceAccess(req.session.user.id, storageId, "storage", prisma);

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
    res.status(StatusCodes.MethodNotAllowed).send(null);
  }
};

export default withApiErrorHandling(withIronSessionApiRoute(handler, sessionSettings));
