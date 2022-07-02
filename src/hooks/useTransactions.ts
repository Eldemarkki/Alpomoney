import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import {
  addTransaction,
  removeTransaction,
  setTransactions,
  editTransaction as editTransactionRedux
} from "../features/transactionsSlice";
import { Transaction, TransactionId, WithoutIds } from "@alpomoney/shared";
import { ConvertDates } from "../utils/types";

export const useTransactions = () => {
  const transactions = useSelector((state: RootState) => state.transactions.transactions).map(transaction => ({
    ...transaction,
    createdAt: new Date(transaction.createdAt)
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get<ConvertDates<Transaction>[]>("/api/transactions").then(({ data }) => {
      dispatch(setTransactions(data));
    }).catch(e => console.log(e));
  }, [dispatch]);

  const createTransaction = async (
    amount: number,
    description: string,
    sinkId: string,
    storageId: string,
    category: string
  ) => {
    const response = await axios.post<ConvertDates<Transaction>>(
      "/api/transactions",
      { amount, description, sinkId, storageId, category },
      { withCredentials: true }
    );
    console.log(response.data);
    dispatch(addTransaction(response.data));
    return response.data;
  };

  const deleteTransaction = async (id: string) => {
    await axios.delete(`/api/transactions/${id}`, { withCredentials: true });
    dispatch(removeTransaction(id));
  };

  const editTransaction = async (id: TransactionId, data: Partial<WithoutIds<ConvertDates<Transaction>>>) => {
    const response = await axios.put<ConvertDates<Transaction>>(
      `/api/transactions/${id}`,
      data,
      { withCredentials: true }
    );
    dispatch(editTransactionRedux({
      id: id,
      data: response.data
    }));
    return response.data;
  };

  return {
    transactions,
    createTransaction,
    deleteTransaction,
    editTransaction
  };
};
