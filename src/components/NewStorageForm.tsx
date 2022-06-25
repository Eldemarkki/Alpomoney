import { Storage } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addStorage } from "../features/storagesSlice";
import { centify } from "../utils/moneyUtils";
import { Button } from "./Button";
import { NumberInput } from "./NumberInput";
import { TextInput } from "./TextInput";

interface Props {
  onCreate: (storage: Storage) => void
}

export const NewStorageForm = (props: Props) => {
  const [name, setName] = useState("");
  const [startAmount, setSum] = useState(0);

  const dispatch = useDispatch();

  return <form onSubmit={async e => {
    e.preventDefault();
    const response = await axios.post<Storage>("/api/storages", {
      name,
      startAmount: centify(startAmount)
    });

    dispatch(addStorage(response.data));
    props.onCreate(response.data);
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
          <td><label htmlFor="sum">Sum</label></td>
          <td>
            <NumberInput
              id="sum"
              initialValue={startAmount}
              onChange={setSum}
            />
          </td>
        </tr>
      </tbody>
    </table>
    <Button type="submit" variant="filled">Create</Button>
  </form>;
};
