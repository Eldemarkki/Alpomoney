import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { addStorage, setStorages } from "../features/storagesSlice";
import { Storage } from "../types";

export const useStorages = () => {
  const storages = useSelector((state: RootState) => state.storages.storages);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get<Storage[]>("/api/storages").then(({ data }) => {
      dispatch(setStorages(data));
    }).catch(e => console.log(e));
  }, [dispatch]);

  const createStorage = async (name: string, initialBalance: number) => {
    const response = await axios.post<Storage>("/api/storages", { name, initialBalance }, { withCredentials: true });
    console.log(response.data);
    dispatch(addStorage(response.data));
    return response.data;
  };

  return {
    storages,
    createStorage
  };
};
