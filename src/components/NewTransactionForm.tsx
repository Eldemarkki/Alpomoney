import { Transaction } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../app/store";
import { centify } from "../utils/moneyUtils";
import { ConvertDates } from "../utils/types";
import { Button } from "./Button";

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
            <input
              type="number"
              step={0.01}
              id="amount"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
            />
          </td>
        </tr>
        <tr>
          <td><label htmlFor="description">Description</label></td>
          <td>
            <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} />
          </td>
        </tr>
        <tr>
          <td><label htmlFor="sinkId">Sink</label></td>
          <td>
            <select id="sinkId" value={sinkId} onChange={e => setSinkId(e.target.value)}>
              <option value={undefined}>Select a sink</option>
              {availableSinks.map(sink => <option key={sink.id} value={sink.id}>{sink.name}</option>)}
            </select>
          </td>
        </tr>
        <tr>
          <td><label htmlFor="storageId">Storage</label></td>
          <td>
            <select id="storageId" value={storageId} onChange={e => setStorageId(e.target.value)}>
              <option value={undefined}>Select a storage</option>
              {availableStorages.map(storage => <option key={storage.id} value={storage.id}>{storage.name}</option>)}
            </select>
          </td>
        </tr>
      </tbody>
    </table>
    <Button type="submit" variant="filled">Create</Button>
  </FormComponent>;
};
