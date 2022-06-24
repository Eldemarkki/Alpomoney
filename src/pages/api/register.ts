import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import bcrypt from "bcryptjs";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { hasKey } from "../../utils/types";

export default withIronSessionApiRoute(
  async function registerRoute(req, res) {
    if (req.method === "POST") {

      if (!hasKey(req.body, "username")) {
        return res.status(400).json({ error: "Missing username" });
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

      if (username && password) {
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
        res.send({ ok: true });
      }
      else {
        res.send({ ok: false });
      }
    }
  },
  sessionSettings
);
