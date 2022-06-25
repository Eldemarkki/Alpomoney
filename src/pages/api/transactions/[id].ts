import { PrismaClient, Transaction } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { sessionSettings } from "../../../sessions/ironSessionSettings";
import { getOptionalValue, getValue, requireAuthentication } from "../../../utils/apiUtils";
import { numberValidator, stringValidator, uuidValidator } from "../../../utils/apiValidators";
import { withApiErrorHandling } from "../../../utils/errorHandling";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "DELETE") {
    requireAuthentication(req, "You must be logged in to delete a transaction");

    // TODO: Check that the user has access to the transaction
    const id = getValue(req.query, "id", uuidValidator);

    const prisma = new PrismaClient();
    await prisma.transaction.delete({
      where: {
        id: String(id)
      }
    });

    return res.json({ success: true });
  }
  if (req.method === "PUT") {
    requireAuthentication(req, "You must be logged in to update a transaction");

    // TODO: Check that the user has access to the sink, storage and transaction

    const id = getValue(req.query, "id", uuidValidator);

    const editedTransaction: Partial<Transaction> = {};
    editedTransaction.amount = getOptionalValue(req.body, "amount", numberValidator);
    editedTransaction.description = getOptionalValue(req.body, "description", stringValidator);
    editedTransaction.sinkId = getOptionalValue(req.body, "sinkId", uuidValidator);
    editedTransaction.storageId = getOptionalValue(req.body, "storageId", uuidValidator);

    const prisma = new PrismaClient();
    const newTransaction = await prisma.transaction.update({
      where: {
        id
      },
      data: editedTransaction
    });

    return res.json(newTransaction);
  }
  else {
    res.status(405).send(null);
  }
};

export default withApiErrorHandling(withIronSessionApiRoute(handler, sessionSettings));
