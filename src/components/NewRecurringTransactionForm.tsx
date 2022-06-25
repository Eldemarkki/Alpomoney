import { RecurringTransaction, RecurringTransactionFrequency } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { addRecurringTransaction } from "../features/recurringTransactionsSlice";
import { centify } from "../utils/moneyUtils";
import { ConvertDates } from "../utils/types";
import { Button } from "./Button";
import { NumberInput } from "./inputs/NumberInput";
import { TextInput } from "./inputs/TextInput";
import { DatePicker } from "@mantine/dates";
import { SinkInput } from "./inputs/SinkInput";
import { StorageInput } from "./inputs/StorageInput";

interface Props {
  onCreate?: (transaction: ConvertDates<RecurringTransaction> & {
    Sink: {
      name: string
    },
    Storage: {
      name: string
    }
  }) => void
}

export const NewRecurringTransactionForm = (props: Props) => {
  const availableSinks = useSelector((state: RootState) => state.sinks.sinks);
  const availableStorages = useSelector((state: RootState) => state.storages.storages);

  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [sinkId, setSinkId] = useState<string>(undefined);
  const [storageId, setStorageId] = useState<string>(undefined);
  const [frequency, setFrequency] = useState<RecurringTransactionFrequency>("MONTHLY");
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
      props.onCreate({
        ...response.data,
        Sink: {
          name: availableSinks.find(sink => sink.id === response.data.sinkId)?.name
        },
        Storage: {
          name: availableStorages.find(storage => storage.id === response.data.storageId)?.name
        }
      });
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
            <SinkInput
              id="sinkId"
              sinks={availableSinks}
              onChange={setSinkId}
            />
          </td>
        </tr>
        <tr>
          <td><label htmlFor="storageId">Storage</label></td>
          <td>
            <StorageInput
              id="storageId"
              storages={availableStorages}
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
            <DatePicker
              id="nextDate"
              value={nextDate}
              onChange={setNextDate}
            />
          </td>
        </tr>
      </tbody>
    </table>
    <Button type="submit" variant="filled">Create</Button>
  </form>;
};
