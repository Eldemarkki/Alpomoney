import { Storage } from "@alpomoney/shared";
import { useState } from "react";
import { useStorages } from "../hooks/useStorages";
import { centify } from "../utils/moneyUtils";
import { Button } from "./Button";
import { NumberInput } from "./inputs/NumberInput";
import { TextInput } from "./inputs/TextInput";

interface Props {
  onCreate: (storage: Storage) => void
}

export const NewStorageForm = (props: Props) => {
  const [name, setName] = useState("");
  const [startAmount, setSum] = useState(0);

  const { createStorage } = useStorages();
  console.log(startAmount);
  return <form onSubmit={async e => {
    e.preventDefault();
    const storage = await createStorage(name, centify(startAmount));
    props.onCreate(storage);
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
