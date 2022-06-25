import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { sessionSettings } from "../../../sessions/ironSessionSettings";
import { getValue, requireAuthentication } from "../../../utils/apiUtils";
import { uuidValidator } from "../../../utils/apiValidators";
import { withApiErrorHandling } from "../../../utils/errorHandling";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "DELETE") {
    requireAuthentication(req, "You must be logged in to delete a storage");

    // TODO: Check that the user has access to the storage

    const id = getValue(req.query, "id", uuidValidator);

    const prisma = new PrismaClient();
    await prisma.storage.delete({
      where: {
        id
      }
    });

    return res.json({ success: true });
  }
  else {
    res.status(405).send(null);
  }
};

export default withApiErrorHandling(withIronSessionApiRoute(handler, sessionSettings));
