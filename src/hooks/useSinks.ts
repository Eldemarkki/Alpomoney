import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { addSink, setSinks } from "../features/sinksSlice";
import { Sink } from "@alpomoney/shared";

export const useSinks = () => {
  const sinks = useSelector((state: RootState) => state.sinks.sinks);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get<Sink[]>("/api/sinks").then(({ data }) => {
      dispatch(setSinks(data));
    }).catch(e => console.log(e));
  }, [dispatch]);

  const createSink = async (name: string) => {
    const response = await axios.post<Sink>("/api/sinks", { name }, { withCredentials: true });
    console.log(response.data);
    dispatch(addSink(response.data));
    return response.data;
  };

  return {
    sinks,
    createSink
  };
};
