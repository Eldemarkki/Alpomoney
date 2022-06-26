import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import {
  BadRequestError,
  getOptionalValue,
  getValue,
  requireAuthentication,
  requireResourceAccess,
  StatusCodes
} from "../../utils/apiUtils";
import {
  nonEmptyStringValidator,
  numberValidator,
  recurringTransactionFrequencyValidator,
  stringOrNumberValidator,
  stringValidator,
  uuidValidator
} from "../../utils/apiValidators";
import { withApiErrorHandling } from "../../utils/errorHandling";
import { isValidDate } from "../../utils/types";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    requireAuthentication(req, "You must be logged in to get transactions");

    const prisma = new PrismaClient();

    const transactions = await prisma.recurringTransaction.findMany({
      where: {
        userId: req.session.user.id
      }
    });

    return res.json(transactions);
  }
  else if (req.method === "POST") {
    requireAuthentication(req, "You must be logged in to create a recurring transaction");

    const name = getValue(req.body, "name", nonEmptyStringValidator);
    const amount = getValue(req.body, "amount", numberValidator);
    const sinkId = getValue(req.body, "sinkId", uuidValidator);
    const storageId = getValue(req.body, "storageId", uuidValidator);
    const frequency = getValue(req.body, "frequency", recurringTransactionFrequencyValidator);
    const category = getOptionalValue(req.body, "category", stringValidator);
    const startDate = getValue(req.body, "startDate", stringOrNumberValidator);

    if (!isValidDate(startDate)) {
      throw BadRequestError("startDate must be a valid date");
    }

    const prisma = new PrismaClient();

    await requireResourceAccess(req.session.user.id, sinkId, "sink", prisma);
    await requireResourceAccess(req.session.user.id, storageId, "storage", prisma);

    const recurringTransaction = await prisma.recurringTransaction.create({
      data: {
        amount,
        name,
        frequency,
        sinkId,
        storageId,
        category,
        userId: req.session.user.id,
        startDate: new Date(startDate)
      }
    });

    res.json(recurringTransaction);
  }
  else {
    res.status(StatusCodes.MethodNotAllowed).send(null);
  }
};

export default withApiErrorHandling(withIronSessionApiRoute(handler, sessionSettings));
