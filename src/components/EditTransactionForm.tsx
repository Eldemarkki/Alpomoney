import { Transaction } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../app/store";
import { centify, decentify } from "../utils/moneyUtils";
import { ConvertDates } from "../utils/types";
import { Button } from "./Button";

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
            <select id="sinkId" value={sinkId || undefined} onChange={e => setSinkId(e.target.value)}>
              <option value={""}>Select a sink</option>
              {sinks.map(sink => <option key={sink.id} value={sink.id}>{sink.name}</option>)}
            </select>
          </td>
        </tr>
        <tr>
          <td><label htmlFor="storageId">Storage</label></td>
          <td>
            <select id="storageId" value={storageId || undefined} onChange={e => setStorageId(e.target.value)}>
              <option value={""}>Select a storage</option>
              {storages.map(storage => <option key={storage.id} value={storage.id}>{storage.name}</option>)}
            </select>
          </td>
        </tr>
      </tbody>
    </table>
    <Button type="submit" variant="filled">Save</Button>
  </FormComponent>;
};
