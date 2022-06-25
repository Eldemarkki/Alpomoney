import { Transaction } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../app/store";
import { centify, decentify } from "../utils/moneyUtils";
import { ConvertDates } from "../utils/types";
import { Button } from "./Button";
import { NumberInput } from "./inputs/NumberInput";
import { SinkInput } from "./inputs/SinkInput";
import { StorageInput } from "./inputs/StorageInput";
import { TextInput } from "./inputs/TextInput";

interface Props {
  onUpdate?: (transaction: ConvertDates<Transaction> & {
    Sink: {
      name: string
    },
    Storage: {
      name: string
    }
  }) => void,
  transaction: ConvertDates<Transaction> & {
    Sink: {
      name: string
    },
    Storage: {
      name: string
    }
  }
}

const FormComponent = styled.form({
  display: "flex",
  flexDirection: "column",
  gap: 16
});

export const EditTransactionForm = ({
  onUpdate,
  transaction
}: Props) => {
  const [amount, setAmount] = useState(decentify(transaction.amount));
  const [description, setDescription] = useState(transaction.description);
  const [sinkId, setSinkId] = useState(transaction.sinkId);
  const [storageId, setStorageId] = useState(transaction.storageId);

  const sinks = useSelector((state: RootState) => state.sinks.sinks);
  const storages = useSelector((state: RootState) => state.storages.storages);

  if (!sinks || !storages) {
    return undefined;
  }

  return <FormComponent onSubmit={async e => {
    e.preventDefault();
    const response = await axios.put<ConvertDates<Transaction>>(`/api/transactions/${transaction.id}`, {
      amount: centify(amount),
      description,
      sinkId,
      storageId
    });

    if (onUpdate) {
      onUpdate({
        ...response.data,
        Sink: {
          name: sinks.find(sink => sink.id === response.data.sinkId)?.name
        },
        Storage: {
          name: storages.find(storage => storage.id === response.data.storageId)?.name
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
              initialValue={decentify(transaction.amount)}
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
              defaultValue={transaction.sinkId}
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
              defaultValue={transaction.storageId}
            />
          </td>
        </tr>
      </tbody>
    </table>
    <Button type="submit" variant="filled">Save</Button>
  </FormComponent>;
};
