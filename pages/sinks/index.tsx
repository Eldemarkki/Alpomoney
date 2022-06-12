import { PrismaClient, Sink, User } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { useDispatch, useSelector } from "react-redux";
import { addSink, setSinks } from "../../features/sinksSlice";
import { RootState } from "../../app/store";

interface Props {
  sinks: Sink[],
  user: Omit<User, "passwordHash">,
}

export default function SinksPage(props: Props) {
  const [name, setName] = useState("");
  const sinks = useSelector((state: RootState) => state.sinks.sinks);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSinks(props.sinks));
  }, [dispatch, props.sinks]);

  return <>
    <h1>Sinks</h1>
    {sinks.map(sink => {
      return <div key={sink.id}>{sink.name}</div>;
    })}
    <form onSubmit={async (e) => {
      e.preventDefault();
      const response = await axios.post<Sink>("/api/sinks", { name });
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
