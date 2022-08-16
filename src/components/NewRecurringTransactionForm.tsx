
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addRecurringTransaction } from "../features/recurringTransactionsSlice";
import { centify } from "../utils/moneyUtils";
import { ConvertDates, isValidDate } from "../utils/types";
import { Button } from "./Button";
import { NumberInput } from "./inputs/NumberInput";
import { TextInput } from "./inputs/TextInput";
import { SinkInput } from "./inputs/SinkInput";
import { StorageInput } from "./inputs/StorageInput";
import { RecurringTransaction, RecurringTransactionFrequency, SinkId, StorageId } from "@alpomoney/shared";

interface Props {
  onCreate?: (transaction: ConvertDates<RecurringTransaction>) => void
}

export const NewRecurringTransactionForm = (props: Props) => {
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [sinkId, setSinkId] = useState<SinkId | undefined>(undefined);
  const [storageId, setStorageId] = useState<StorageId | undefined>(undefined);
  const [frequency, setFrequency] = useState<RecurringTransactionFrequency>("monthly");
  const [category, setCategory] = useState<string>("");
  const [nextDate, setNextDate] = useState<Date>(new Date());

  const dispatch = useDispatch();

  return <form onSubmit={async e => {
    e.preventDefault();
    const response = await axios.post<ConvertDates<RecurringTransaction>>("/api/recurringTransactions", {
      name,
      amount: centify(amount),
      description,
      sinkId,
      storageId,
      frequency,
      category,
      startDate: nextDate.getTime()
    });

    dispatch(addRecurringTransaction(response.data));

    if (props.onCreate) {
      props.onCreate(response.data);
    }
  }}>
    <table>
      <tbody>
        <tr>
          <td><label htmlFor="name">Name</label></td>
          <td>
            <TextInput
              id="name"
              value={name}
              onChange={setName}
              placeholder="Name"
            />
          </td>
        </tr>
        <tr>
          <td><label htmlFor="amount">Amount</label></td>
          <td>
            <NumberInput
              id="amount"
              initialValue={0}
              onChange={setAmount}
            />
          </td>
        </tr>
        <tr>
          <td><label htmlFor="description">Description</label></td>
          <td>
            <TextInput
              id="description"
              value={description}
              onChange={setDescription}
              placeholder="Description"
            />
          </td>
        </tr>
        <tr>
          <td><label htmlFor="frequency">Frequency</label></td>
          <td>
            <select
              id="frequency"
              value={frequency}
              onChange={e => setFrequency(e.target.value as RecurringTransactionFrequency)}
            >
              <option value={"daily"}>Daily</option>
              <option value={"weekly"}>Weekly</option>
              <option value={"monthly"}>Monthly</option>
              <option value={"yearly"}>Yearly</option>
            </select>
          </td>
        </tr>
        <tr>
          <td><label htmlFor="sinkId">Sink</label></td>
          <td>
            <SinkInput
              id="sinkId"
              onChange={setSinkId}
            />
          </td>
        </tr>
        <tr>
          <td><label htmlFor="storageId">Storage</label></td>
          <td>
            <StorageInput
              id="storageId"
              onChange={setStorageId}
            />
          </td>
        </tr>
        <tr>
          <td><label htmlFor="category">Category</label></td>
          <td>
            <TextInput
              id="category"
              value={category}
              onChange={setCategory}
              placeholder="Category"
            />
          </td>
        </tr>
        <tr>
          <td><label htmlFor="nextDate">Next date</label></td>
          <td>
            <input
              id="nextDate"
              type="date"
              value={nextDate?.toISOString().split("T")[0]}
              onChange={e =>
                setNextDate(isValidDate(new Date(e.target.value)) ? new Date(e.target.value) : new Date())}
            />
          </td>
        </tr>
      </tbody>
    </table>
    <Button type="submit" variant="filled">Create</Button>
  </form>;
};
