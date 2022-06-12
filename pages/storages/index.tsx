import { PrismaClient, Storage } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { useDispatch, useSelector } from "react-redux";
import { removeStorage, setStorages } from "../../features/storagesSlice";
import { RootState } from "../../app/store";
import { InferGetServerSidePropsType } from "next";

export default function Storages(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setStorages(props.storages));
  }, [dispatch, props.storages]);

  const storages = useSelector((state: RootState) => state.storages.storages);

  const [name, setName] = useState("");

  return <>
    <h1>Storages</h1>
    <table>
      <thead>
        <tr>
          <th style={{ paddingRight: 30 }}>Name</th>
          <th>Sum</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {[...storages].sort((a, b) => b.sum - a.sum).map(storage => <tr key={storage.id}>
          <td>{storage.name}</td>
          <td align='right'>{storage.sum}€</td>
          <td>
            <button onClick={async () => {
              await axios.delete(`/api/storages/${storage.id}`);
              dispatch(removeStorage(storage.id));
            }}>Delete</button>
          </td>
        </tr>)}
      </tbody>
    </table>
    <form onSubmit={async (e) => {
      e.preventDefault();
      const response = await axios.post<Storage>("/api/storages", { name });
      dispatch(setStorages([...storages, { ...response.data, sum: 0 }]));
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

    // TODO: Fix this n+1 problem
    const storages = await prisma.storage.findMany({});

    const storagesWithSum = await Promise.all(storages.map(async storage => {
      const sum = await prisma.transaction.aggregate({
        _sum: {
          amount: true
        },
        where: {
          storageId: storage.id
        }
      });

      return {
        ...storage,
        sum: sum._sum.amount || 0
      }
    }))

    return {
      props: {
        storages: storagesWithSum,
        user: user
      }
    }
  },
  sessionSettings
);
