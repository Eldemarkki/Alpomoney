import { PrismaClient, Storage, User } from "@prisma/client";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionSettings } from "../../sessions/ironSessionSettings";

type StorageWithSum = Storage & { sum: number };

interface Props {
  storages: StorageWithSum[],
  user: Omit<User, "passwordHash">,
}

interface StorageFormProps {
  onSubmit: (name: string) => Promise<void>
}

const StorageForm = (props: StorageFormProps) => {
  const [name, setName] = useState("");

  return <form onSubmit={(e) => {
    e.preventDefault();
    props.onSubmit(name);
  }}>
    <input type="text" value={name} onChange={e => setName(e.target.value)} />
    <button type="submit">Submit</button>
  </form>;
};

export default function Storages(props: Props) {
  const [storages, setStorages] = useState(props.storages);

  return <>
    <h1>Storages</h1>
    {props.storages.map(storage => {
      return <div key={storage.id}>{storage.name} ({storage.sum})</div>;
    })}
    <p>Hello! {props.user.name} {props.user.id}</p>
    <StorageForm onSubmit={async (name) => {
      const newStorage = await axios.post<Storage>("/api/storages", { name, userId: "hmm" });
      setStorages([...storages, { ...newStorage.data, sum: 0 }]);
    }} />
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
        sum: sum._sum.amount
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
