import { PrismaClient, Sink } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { useDispatch, useSelector } from "react-redux";
import { addSink, removeSink, setSinks } from "../../features/sinksSlice";
import { RootState } from "../../app/store";
import { InferGetServerSidePropsType } from "next";
import { Button } from "../../components/Button";

interface SinkRowProps {
  sink: Sink
}

const SinkRow = (props: SinkRowProps) => {
  const dispatch = useDispatch();
  const [deleting, setDeleting] = useState(false);

  return <tr>
    <td>{props.sink.name}</td>
    <td>
      <Button
        loading={deleting}
        onClick={async () => {
          setDeleting(true);
          await axios.delete(`/api/sinks/${props.sink.id}`);
          dispatch(removeSink(props.sink.id));
        }}
      >
        Delete
      </Button>
    </td>
  </tr>;
};

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
          <th />
        </tr>
      </thead>
      <tbody>
        {sinks.map(sink => <SinkRow key={sink.id} sink={sink} />)}
      </tbody>
    </table>
    <form onSubmit={async e => {
      e.preventDefault();
      const response = await axios.post<Sink>("/api/sinks", {
        name
      });
      dispatch(addSink(response.data));
    }}>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <Button type="submit">Submit</Button>
    </form>
  </>;
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    if (!user) {
      return {
        redirect: {
          destination: "/login",
          permanent: false
        }
      };
    }

    const prisma = new PrismaClient();

    const sinks = await prisma.sink.findMany({});

    return {
      props: {
        sinks,
        user
      }
    };
  },
  sessionSettings
);
