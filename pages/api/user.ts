import { withIronSessionApiRoute } from "iron-session/next";
import { sessionSettings } from "../../sessions/ironSessionSettings";

export default withIronSessionApiRoute(
  function userRoute(req, res) {
    res.send({ user: req.session.user });
  },
  sessionSettings
);
