import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { sessionSettings } from "../../../sessions/ironSessionSettings";
import { getValue, requireAuthentication, requireResourceAccess, StatusCodes } from "../../../utils/apiUtils";
import { uuidValidator } from "../../../utils/apiValidators";
import { withApiErrorHandling } from "../../../utils/errorHandling";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "DELETE") {
    requireAuthentication(req, "You must be logged in to delete a storage");

    const storageId = getValue(req.query, "id", uuidValidator);
    const prisma = new PrismaClient();

    await requireResourceAccess(req.session.user.id, storageId, "storage", prisma);

    await prisma.storage.delete({
      where: {
        id: storageId
      }
    });

    return res.json({ success: true });
  }
  else {
    res.status(StatusCodes.MethodNotAllowed).send(null);
  }
};

export default withApiErrorHandling(withIronSessionApiRoute(handler, sessionSettings));
