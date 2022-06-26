import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import bcrypt from "bcryptjs";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { getValue, StatusCodes } from "../../utils/apiUtils";
import { nonEmptyStringValidator } from "../../utils/apiValidators";
import { withApiErrorHandling } from "../../utils/errorHandling";

export default withApiErrorHandling(withIronSessionApiRoute(
  async function registerRoute(req, res) {
    if (req.method === "POST") {
      const username = getValue(req.body, "username", nonEmptyStringValidator);
      const password = getValue(req.body, "password", nonEmptyStringValidator);

      const prisma = new PrismaClient();

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name: username,
          passwordHash: passwordHash
        }
      });

      const { passwordHash: _, ...userWithoutPasswordHash } = user;

      req.session.user = userWithoutPasswordHash;
      await req.session.save();

      return res.json(userWithoutPasswordHash);
    }
    else {
      res.status(StatusCodes.MethodNotAllowed).send(null);
    }
  },
  sessionSettings
));
