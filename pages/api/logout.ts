import { withIronSessionApiRoute } from "iron-session/next";
import { sessionSettings } from "../../sessions/ironSessionSettings";

export default withIronSessionApiRoute(
  async function logoutRoute(req, res) {
    req.session.destroy();
    res.send({ ok: true });
  },
  sessionSettings
);