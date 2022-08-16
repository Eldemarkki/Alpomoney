import { SinkId, StorageId, Transaction } from "@alpomoney/shared";
import { useState } from "react";
import styled from "styled-components";
import { centify, decentify } from "../utils/moneyUtils";
import { ConvertDates } from "../utils/types";
import { Button } from "./Button";
import { NumberInput } from "./inputs/NumberInput";
import { SinkInput } from "./inputs/SinkInput";
import { StorageInput } from "./inputs/StorageInput";
import { TextInput } from "./inputs/TextInput";
import { useTransactions } from "../hooks/useTransactions";

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
  const { editTransaction } = useTransactions();

  const [amount, setAmount] = useState(decentify(transaction.amount));
  const [description, setDescription] = useState(transaction.description);
  const [sinkId, setSinkId] = useState<SinkId | undefined>(transaction.sinkId);
  const [storageId, setStorageId] = useState<StorageId | undefined>(transaction.storageId);

  return <FormComponent onSubmit={async e => {
    e.preventDefault();
    if (!sinkId) {
      return;
    }
    if (!storageId) {
      return;
    }

    const updated = await editTransaction(transaction.id, {
      amount: centify(amount),
      description,
      sinkId,
      storageId
    });

    if (onUpdate) {
      onUpdate(updated);
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
