import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { getOptionalValue, getValue, requireAuthentication } from "../../utils/apiUtils";
import { nonEmptyStringValidator, numberValidator } from "../../utils/apiValidators";
import { withApiErrorHandling } from "../../utils/errorHandling";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    requireAuthentication(req, "You must be logged in to get storages");
    // TODO: Only return sinks that the user can see
    const prisma = new PrismaClient();
    const storages = await prisma.storage.findMany({});

    res.json(storages);
  }
  else if (req.method === "POST") {
    requireAuthentication(req, "You must be logged in to create a storage");

    const name = getValue(req.body, "name", nonEmptyStringValidator);
    const startAmount = getOptionalValue(req.body, "startAmount", numberValidator);

    const prisma = new PrismaClient();
    const storage = await prisma.storage.create({
      data: {
        userId: req.session.user.id,
        name,
        startAmount
      }
    });

    res.json(storage);
  }
  else {
    res.status(405).send(null);
  }
};

export default withApiErrorHandling(withIronSessionApiRoute(handler, sessionSettings));
