import { Transaction } from "@alpomoney/shared";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { centify } from "../utils/moneyUtils";
import { ConvertDates, isValidDate } from "../utils/types";
import { Button } from "./Button";
import { NumberInput } from "./inputs/NumberInput";
import { SinkInput } from "./inputs/SinkInput";
import { StorageInput } from "./inputs/StorageInput";
import { TextInput } from "./inputs/TextInput";
import { useSinks } from "../hooks/useSinks";
import { useStorages } from "../hooks/useStorages";
import { addTransaction } from "../features/transactionsSlice";

const FormComponent = styled.form({
  display: "flex",
  flexDirection: "column",
  gap: 16
});

interface Props {
  onCreate?: (transaction: ConvertDates<Transaction>) => void
}

export const NewTransactionForm = (props: Props) => {
  const { sinks } = useSinks();
  const { storages } = useStorages();

  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [sinkId, setSinkId] = useState<string | undefined>(undefined);
  const [storageId, setStorageId] = useState<string | undefined>(undefined);
  const [createdAt, setCreatedAt] = useState<Date>(new Date());

  const dispatch = useDispatch();

  return <FormComponent onSubmit={async e => {
    e.preventDefault();
    const response = await axios.post<ConvertDates<Transaction>>("/api/transactions", {
      amount: centify(amount),
      description,
      sinkId,
      storageId,
      createdAt: createdAt?.getTime()
    });

    dispatch(addTransaction(response.data));
    props.onCreate && props.onCreate(response.data);
  }}>
    <table>
      <tbody>
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
          <td><label htmlFor="sinkId">Sink</label></td>
          <td>
            <SinkInput
              id="sinkId"
              sinks={sinks}
              onChange={setSinkId}
            />
          </td>
        </tr>
        <tr>
          <td><label htmlFor="storageId">Storage</label></td>
          <td>
            <StorageInput
              id="storageId"
              storages={storages}
              onChange={setStorageId}
            />
          </td>
        </tr>
        <tr>
          <td><label htmlFor="createdAt">Date</label></td>
          <td>
            <input
              id="createdAt"
              type="date"
              value={createdAt?.toISOString().split("T")[0]}
              onChange={e =>
                setCreatedAt(isValidDate(new Date(e.target.value)) ? new Date(e.target.value) : new Date())}
            />
          </td>
        </tr>
      </tbody>
    </table>
    <Button type="submit" variant="filled">Create</Button>
  </FormComponent>;
};
