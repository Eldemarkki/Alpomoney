import { RecurringTransaction, RecurringTransactionFrequency, Transaction } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { addRecurringTransaction } from "../features/recurringTransactionsSlice";
import { ConvertDates } from "../utils/types";

interface Props {
  onCreate?: (transaction: ConvertDates<RecurringTransaction> & {
    Sink: {
      name: string
    },
    Storage: {
      name: string
    }
  }) => void;
}

export const NewRecurringTransactionForm = (props: Props) => {
  const availableSinks = useSelector((state: RootState) => state.sinks.sinks);
  const availableStorages = useSelector((state: RootState) => state.storages.storages);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [sinkId, setSinkId] = useState(undefined);
  const [storageId, setStorageId] = useState(undefined);
  const [frequency, setFrequency] = useState<RecurringTransactionFrequency>("MONTHLY");
  const [category, setCategory] = useState("");

  const dispatch = useDispatch();

  return <form onSubmit={async (e) => {
    e.preventDefault();
    const response = await axios.post<ConvertDates<RecurringTransaction>>("/api/recurringTransactions", {
      name,
      amount,
      description,
      sinkId,
      storageId,
      frequency,
      category
    });

    dispatch(addRecurringTransaction(response.data));

    if (props.onCreate) {
      props.onCreate({
        ...response.data,
        Sink: {
          name: availableSinks.find(sink => sink.id === response.data.sinkId)?.name,
        },
        Storage: {
          name: availableStorages.find(storage => storage.id === response.data.storageId)?.name,
        }
      });
    }
  }}>
    <table>
      <tbody>
        <tr>
          <td><label htmlFor="name">Name</label></td>
          <td><input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} /></td>
        </tr>
        <tr>
          <td><label htmlFor="amount">Amount</label></td>
          <td><input type="number" id="amount" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></td>
        </tr>
        <tr>
          <td><label htmlFor="description">Description</label></td>
          <td><input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} /></td>
        </tr>
        <tr>
          <td><label htmlFor="frequency">Frequency</label></td>
          <td>
            <select id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value as RecurringTransactionFrequency)}>
              <option value={"DAILY"}>Daily</option>
              <option value={"WEEKLY"}>Weekly</option>
              <option value={"MONTHLY"}>Monthly</option>
              <option value={"YEARLY"}>Yearly</option>
            </select>
          </td>
        </tr>
        <tr>
          <td><label htmlFor="sinkId">Sink</label></td>
          <td>
            <select id="sinkId" value={sinkId} onChange={(e) => setSinkId(e.target.value)}>
              <option value={undefined}>Select a sink</option>
              {availableSinks.map(sink => <option key={sink.id} value={sink.id}>{sink.name}</option>)}
            </select>
          </td>
        </tr>
        <tr>
          <td><label htmlFor="storageId">Storage</label></td>
          <td>
            <select id="storageId" value={storageId} onChange={(e) => setStorageId(e.target.value)}>
              <option value={undefined}>Select a storage</option>
              {availableStorages.map(storage => <option key={storage.id} value={storage.id}>{storage.name}</option>)}
            </select>
          </td>
        </tr>
        <tr>
          <td><label htmlFor="category">Category</label></td>
          <td><input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} /></td>
        </tr>
      </tbody>
    </table>
    <button type="submit">Create</button>
  </form>;
}