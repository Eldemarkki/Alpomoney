import { User } from "@prisma/client";
import { createContext } from "react";

interface UserContextInterface {
  user?: Omit<User, "passwordHash">,
  setUser: (user: Omit<User, "passwordHash"> | undefined) => void
}

export const UserContext = createContext<UserContextInterface>({
  user: undefined,
  setUser: () => {
    console.log("UserContext not initialized");
  }
});
