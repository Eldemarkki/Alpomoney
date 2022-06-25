import { Transaction } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../app/store";
import { centify } from "../utils/moneyUtils";
import { ConvertDates } from "../utils/types";
import { Button } from "./Button";
import { NumberInput } from "./inputs/NumberInput";
import { SinkInput } from "./inputs/SinkInput";
import { StorageInput } from "./inputs/StorageInput";
import { TextInput } from "./inputs/TextInput";

const FormComponent = styled.form({
  display: "flex",
  flexDirection: "column",
  gap: 16
});

interface Props {
  onCreate?: (transaction: ConvertDates<Transaction> & {
    Sink: {
      name: string
    },
    Storage: {
      name: string
    }
  }) => void
}

export const NewTransactionForm = (props: Props) => {
  const availableSinks = useSelector((state: RootState) => state.sinks.sinks);
  const availableStorages = useSelector((state: RootState) => state.storages.storages);

  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [sinkId, setSinkId] = useState<string>(undefined);
  const [storageId, setStorageId] = useState<string>(undefined);

  return <FormComponent onSubmit={async e => {
    e.preventDefault();
    const response = await axios.post<ConvertDates<Transaction>>("/api/transactions", {
      amount: centify(amount),
      description,
      sinkId,
      storageId
    });

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
      </tbody>
    </table>
    <Button type="submit" variant="filled">Create</Button>
  </FormComponent>;
};
