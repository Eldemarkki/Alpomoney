import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import bcrypt from "bcryptjs";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { getValue } from "../../utils/apiUtils";
import { nonEmptyStringValidator } from "../../utils/apiValidators";
import { ApiError } from "next/dist/server/api-utils";
import { withApiErrorHandling } from "../../utils/errorHandling";

export default withApiErrorHandling(withIronSessionApiRoute(
  async function loginRoute(req, res) {
    const username = getValue(req.body, "username", nonEmptyStringValidator);
    const password = getValue(req.body, "password", nonEmptyStringValidator);

    const prisma = new PrismaClient();
    const user = await prisma.user.findFirst({
      where: {
        name: username
      }
    });

    // Make sure to use the same error, so that an attacker
    // can't tell if the user exists or not.
    const error = new ApiError(401, "Invalid username or password");
    if (!user) {
      throw error;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      throw error;
    }

    const { passwordHash: _, ...userWithoutPasswordHash } = user;
    req.session.user = userWithoutPasswordHash;
    await req.session.save();

    res.json(userWithoutPasswordHash);
  },
  sessionSettings
));
