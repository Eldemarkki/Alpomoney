import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import bcrypt from 'bcryptjs';
import { sessionSettings } from "../../sessions/ironSessionSettings";

export default withIronSessionApiRoute(
  async function registerRoute(req, res) {
    if (req.method === "POST") {
      const { body } = req;
      const { username, password } = body;

      if (username && password) {
        const prisma = new PrismaClient()

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
          data: {
            name: username,
            passwordHash: passwordHash,
          }
        });

        const { passwordHash: _, ...userWithoutPasswordHash } = user;

        req.session.user = userWithoutPasswordHash;
        await req.session.save();
        res.send({ ok: true });
      }
      else {
        res.send({ ok: false });
      }
    }
  },
  sessionSettings
)