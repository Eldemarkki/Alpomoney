import { withIronSessionApiRoute } from "iron-session/next";
import { sessionSettings } from "../../sessions/ironSessionSettings";

export default withIronSessionApiRoute(
  function logoutRoute(req, res) {
    req.session.destroy();
    res.redirect("/login");
  },
  sessionSettings
);
