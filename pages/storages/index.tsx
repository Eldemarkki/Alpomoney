import { PrismaClient, Storage, User } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionSettings } from "../../sessions/ironSessionSettings";

type StorageWithSum = Storage & { sum: number };

interface Props {
  storages: StorageWithSum[],
  user: Omit<User, "passwordHash">,
}

export default function Storages(props: Props) {
  const [storages, setStorages] = useState(props.storages);
  const [name, setName] = useState("");

  return <>
    <h1>Storages</h1>
    <table>
      <thead>
        <tr>
          <th style={{ paddingRight: 30 }}>Name</th>
          <th>Sum</th>
        </tr>
      </thead>
      <tbody>
        {[...props.storages].sort((a, b) => b.sum - a.sum).map(storage => <tr key={storage.id}>
          <td>{storage.name}</td>
          <td align='right'>{storage.sum}€</td>
        </tr>)}
      </tbody>
    </table>
    <form onSubmit={async (e) => {
      e.preventDefault();
      const response = await axios.post<Storage>("/api/storages", { name });
      setStorages([...storages, { ...response.data, sum: 0 }]);
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
