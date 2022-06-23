import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import bcrypt from "bcryptjs";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { hasKey } from "../../utils/types";

export default withIronSessionApiRoute(
  async function loginRoute(req, res) {
    if (!hasKey(req.body, "username")) {
      return res.status(400).json({ error: "Missing email" });
    }
    if (typeof req.body.username !== "string") {
      return res.status(400).json({ error: "Username must be a string" });
    }
    if (!hasKey(req.body, "password")) {
      return res.status(400).json({ error: "Missing password" });
    }
    if (typeof req.body.password !== "string") {
      return res.status(400).json({ error: "Password must be a string" });
    }

    const { username, password } = req.body;
    const prisma = new PrismaClient();
    const user = await prisma.user.findFirst({
      where: {
        name: username
      }
    });

    if (!user) {
      return res.status(401).send({ ok: false });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (valid) {
      const { passwordHash: _, ...userWithoutPasswordHash } = user;
      req.session.user = userWithoutPasswordHash;
      await req.session.save();
      res.send({ ok: true });
    }
    else {
      res.send({ ok: false });
    }
  },
  sessionSettings
);
