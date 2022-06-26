import { PrismaClient, Transaction } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { sessionSettings } from "../../../sessions/ironSessionSettings";
import {
  getOptionalValue,
  getValue,
  requireAuthentication,
  requireResourceAccess,
  StatusCodes
} from "../../../utils/apiUtils";
import { numberValidator, stringValidator, uuidValidator } from "../../../utils/apiValidators";
import { withApiErrorHandling } from "../../../utils/errorHandling";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "DELETE") {
    requireAuthentication(req, "You must be logged in to delete a transaction");

    const transactionId = getValue(req.query, "id", uuidValidator);
    const prisma = new PrismaClient();

    await requireResourceAccess(req.session.user.id, transactionId, "transaction", prisma);

    await prisma.transaction.delete({
      where: {
        id: transactionId
      }
    });

    return res.json({ success: true });
  }
  if (req.method === "PUT") {
    requireAuthentication(req, "You must be logged in to update a transaction");

    const transactionId = getValue(req.query, "id", uuidValidator);

    const editedTransaction: Partial<Transaction> = {};
    editedTransaction.amount = getOptionalValue(req.body, "amount", numberValidator);
    editedTransaction.description = getOptionalValue(req.body, "description", stringValidator);
    editedTransaction.sinkId = getOptionalValue(req.body, "sinkId", uuidValidator);
    editedTransaction.storageId = getOptionalValue(req.body, "storageId", uuidValidator);

    const prisma = new PrismaClient();

    await requireResourceAccess(req.session.user.id, transactionId, "transaction", prisma);
    if (editedTransaction.sinkId) {
      await requireResourceAccess(req.session.user.id, editedTransaction.sinkId, "sink", prisma);
    }
    if (editedTransaction.storageId) {
      await requireResourceAccess(req.session.user.id, editedTransaction.storageId, "storage", prisma);
    }

    const newTransaction = await prisma.transaction.update({
      where: {
        id: transactionId
      },
      data: editedTransaction
    });

    return res.json(newTransaction);
  }
  else {
    res.status(StatusCodes.MethodNotAllowed).send(null);
  }
};

export default withApiErrorHandling(withIronSessionApiRoute(handler, sessionSettings));
