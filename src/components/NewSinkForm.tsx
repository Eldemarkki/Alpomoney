import { Sink } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addSink } from "../features/sinksSlice";
import { Button } from "./Button";

interface Props {
  onCreate: (sink: Sink) => void
}

export const NewSinkForm = (props: Props) => {
  const [name, setName] = useState("");

  const dispatch = useDispatch();

  return <form onSubmit={async e => {
    e.preventDefault();
    const response = await axios.post<Sink>("/api/sinks", {
      name
    });

    dispatch(addSink(response.data));
    props.onCreate(response.data);
  }}>
    <table>
      <tbody>
        <tr>
          <td><label htmlFor="name">Name</label></td>
          <td><input type="text" id="name" value={name} onChange={e => setName(e.target.value)} /></td>
        </tr>
      </tbody>
    </table>
    <Button type="submit" variant="filled">Create</Button>
  </form>;
};
