import { PrismaClient, Sink, User } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { useDispatch, useSelector } from "react-redux";
import { addSink, removeSink, setSinks } from "../../features/sinksSlice";
import { RootState } from "../../app/store";
import { InferGetServerSidePropsType } from "next";

export default function SinksPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [name, setName] = useState("");
  const sinks = useSelector((state: RootState) => state.sinks.sinks);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSinks(props.sinks));
  }, [dispatch, props.sinks]);

  return <>
    <h1>Sinks</h1>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sinks.map(sink => <tr key={sink.id}>
          <td>{sink.name}</td>
          <td><button onClick={async () => {
            await axios.delete(`/api/sinks/${sink.id}`)
            dispatch(removeSink(sink.id))
          }
          }>Delete</button></td>
        </tr>)}
      </tbody>
    </table>
    <form onSubmit={async (e) => {
      e.preventDefault();
      const response = await axios.post<Sink>("/api/sinks", {
        name
      });
      dispatch(addSink(response.data));
    }}>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <button type="submit">Submit</button>
    </form>
  </>
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    const prisma = new PrismaClient();

    const sinks = await prisma.sink.findMany({});

    return {
      props: {
        sinks,
        user
      }
    }
  },
  sessionSettings
);
