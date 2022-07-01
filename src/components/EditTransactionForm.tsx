import { SinkId, StorageId, Transaction } from "../types";
import axios from "axios";
import { useState } from "react";
import styled from "styled-components";
import { centify, decentify } from "../utils/moneyUtils";
import { ConvertDates } from "../utils/types";
import { Button } from "./Button";
import { NumberInput } from "./inputs/NumberInput";
import { SinkInput } from "./inputs/SinkInput";
import { StorageInput } from "./inputs/StorageInput";
import { TextInput } from "./inputs/TextInput";
import { useSinks } from "../hooks/useSinks";
import { useStorages } from "../hooks/useStorages";

interface Props {
  onUpdate?: (transaction: ConvertDates<Transaction>) => void,
  transaction: ConvertDates<Transaction>
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
  const [sinkId, setSinkId] = useState<SinkId | undefined>(transaction.sinkId);
  const [storageId, setStorageId] = useState<StorageId | undefined>(transaction.storageId);

  const { sinks } = useSinks();
  const { storages } = useStorages();

  return <FormComponent onSubmit={async e => {
    e.preventDefault();
    const response = await axios.put<ConvertDates<Transaction>>(`/api/transactions/${transaction.id}`, {
      amount: centify(amount),
      description,
      sinkId,
      storageId
    });

    if (onUpdate) {
      onUpdate(response.data);
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
