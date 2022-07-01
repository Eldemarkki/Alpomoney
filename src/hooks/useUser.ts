import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../contexts/UserContext"
import { User } from "../types";

export const useUser = (reloadLoginState = false) => {
  const { user, setUser, loading, setLoading } = useContext(UserContext);

  useEffect(() => {
    if (reloadLoginState) {
      axios.get<User | undefined>("/api/auth/user", { withCredentials: true }).then(response => {
        setUser(response.data);
        setLoading(false);
      }).catch(e => {
        setLoading(false);
      });
    }
  }, []);

  return {
    user,
    setUser,
    loading
  };
};
