import { Select } from "@mantine/core";
import { Sink, Transaction } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../app/store";
import { addSink } from "../features/sinksSlice";
import { centify } from "../utils/moneyUtils";
import { ConvertDates } from "../utils/types";
import { Button } from "./Button";
import { NumberInput } from "./NumberInput";

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

  const dispatch = useDispatch();

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
            <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} />
          </td>
        </tr>
        <tr>
          <td><label htmlFor="sinkId">Sink</label></td>
          <td>
            <Select
              id="sinkId"
              data={availableSinks.map(sink => ({ value: sink.id, label: sink.name }))}
              value={sinkId}
              onChange={setSinkId}
              creatable
              searchable
              placeholder="Select a sink"
              nothingFound="No sinks"
              getCreateLabel={query => `+ Create ${query}`}
              onCreate={async sinkName => {
                const response = await axios.post<ConvertDates<Sink>>("/api/sinks", {
                  name: sinkName
                });
                dispatch(addSink(response.data));
              }}
            />
          </td>
        </tr>
        <tr>
          <td><label htmlFor="storageId">Storage</label></td>
          <td>
            <Select
              id="storageId"
              data={availableStorages.map(storage => ({ value: storage.id, label: storage.name }))}
              value={storageId}
              onChange={setStorageId}
              creatable
              searchable
              placeholder="Select a storage"
              nothingFound="No storages"
              getCreateLabel={query => `+ Create ${query}`}
              onCreate={async storageName => {
                const response = await axios.post<ConvertDates<Sink>>("/api/storages", {
                  name: storageName
                });
                dispatch(addSink(response.data));
              }}
            />
          </td>
        </tr>
      </tbody>
    </table>
    <Button type="submit" variant="filled">Create</Button>
  </FormComponent>;
};
