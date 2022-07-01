import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { addRecurringTransaction, setRecurringTransactions } from "../features/recurringTransactionsSlice";
import { RecurringTransaction } from "../types";

export const useRecurringTransactions = () => {
  const recurringTransactions = useSelector((state: RootState) => state.recurringTransactions.recurringTransactions);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get<RecurringTransaction[]>("/api/recurringTransactions").then(({ data }) => {
      dispatch(setRecurringTransactions(data));
    }).catch(e => console.log(e));
  }, [dispatch]);

  const createRecurringTransaction = async (amount: number, description: string, sinkId: string, storageId: string, category: string, interval: number, startDate: Date) => {
    const response = await axios.post<RecurringTransaction>(
      "/api/recurringTransactions",
      { amount, description, sinkId, storageId, category, interval, startDate },
      { withCredentials: true }
    )
    console.log(response.data);
    dispatch(addRecurringTransaction(response.data))
    return response.data;
  }

  return {
    recurringTransactions,
    createRecurringTransaction
  }
};