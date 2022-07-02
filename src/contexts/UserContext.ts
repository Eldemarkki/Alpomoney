import { User } from "@alpomoney/shared";
import { createContext } from "react";

interface UserContextInterface {
  user?: User,
  setUser: (user: User | undefined) => void,
  loading: boolean,
  setLoading: (loading: boolean) => void
}

export const UserContext = createContext<UserContextInterface>({
  user: undefined,
  setUser: () => {
    console.log("UserContext not initialized");
  },
  loading: true,
  setLoading: () => {
    console.log("UserContext not initialized");
  }
});
