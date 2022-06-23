import { User } from "@prisma/client";

declare module "iron-session" {
  export interface IronSessionData {
    user: Omit<User, "passwordHash"> | null
  }
}
