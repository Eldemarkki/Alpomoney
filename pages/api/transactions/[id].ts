import { PrismaClient } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { sessionSettings } from "../../../sessions/ironSessionSettings";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "DELETE") {
    const { id } = req.query;
    const prisma = new PrismaClient();
    await prisma.transaction.delete({
      where: {
        id: String(id)
      }
    });

    return res.status(200).json({ success: true });
  }
  else {
    res.status(405).send(null);
  }
};

export default withIronSessionApiRoute(handler, sessionSettings);