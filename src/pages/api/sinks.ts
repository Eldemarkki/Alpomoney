import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { getValue, requireAuthentication, StatusCodes } from "../../utils/apiUtils";
import { nonEmptyStringValidator } from "../../utils/apiValidators";
import { withApiErrorHandling } from "../../utils/errorHandling";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    requireAuthentication(req, "You must be logged in to get sinks");

    const prisma = new PrismaClient();
    const sinks = await prisma.sink.findMany({
      where: {
        userId: req.session.user.id
      }
    });

    res.json(sinks);
  }
  else if (req.method === "POST") {
    requireAuthentication(req, "You must be logged in to create a sink");

    const name = getValue(req.body, "name", nonEmptyStringValidator);

    const prisma = new PrismaClient();
    const sink = await prisma.sink.create({
      data: {
        userId: req.session.user.id,
        name
      }
    });

    res.json(sink);
  }
  else {
    res.status(StatusCodes.MethodNotAllowed).send(null);
  }
};

export default withApiErrorHandling(withIronSessionApiRoute(handler, sessionSettings));
