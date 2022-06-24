import { IronSessionOptions } from "iron-session";

export const sessionSettings: IronSessionOptions = {
  cookieName: "alpomoney-session",
  password: process.env.SESSION_PASSWORD,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production"
  }
};
