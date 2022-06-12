import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import bcrypt from "bcryptjs";
import { sessionSettings } from "../../sessions/ironSessionSettings";

export default withIronSessionApiRoute(
  async function loginRoute(req, res) {
    const { username, password } = req.body;
    const prisma = new PrismaClient();
    const user = await prisma.user.findFirst({
      where: {
        name: username,
      }
    });

    if (!user) {
      return res.status(401).send({ ok: false });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (valid) {
      const { passwordHash, ...userWithoutPasswordHash } = user;
      req.session.user = userWithoutPasswordHash;
      await req.session.save();
      res.send({ ok: true });
    }
    else {
      res.send({ ok: false });
    }
  },
  sessionSettings
)