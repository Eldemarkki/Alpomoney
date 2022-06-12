import { Storage } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addStorage, StorageWithSum } from "../features/storagesSlice";

interface Props {
  onCreate: (storage: StorageWithSum) => void
}

export const NewStorageForm = (props: Props) => {
  const [name, setName] = useState("");
  const dispatch = useDispatch();

  return <form onSubmit={async (e) => {
    e.preventDefault();
    const response = await axios.post<Storage>("/api/storages", { name });
    const storage = { ...response.data, sum: 0 };
    dispatch(addStorage(storage));
    props.onCreate(storage);
  }}>
    <table>
      <tbody>
        <tr>
          <td><label htmlFor="name">Name</label></td>
          <td><input type="text" id="name" value={name} onChange={e => setName(e.target.value)} /></td>
        </tr>
      </tbody>
    </table>
    <button type="submit">Submit</button>
  </form>;
};