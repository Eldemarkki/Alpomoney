import { PrismaClient, Storage } from "@prisma/client";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useState } from "react";

type StorageWithSum = Storage & { sum: number };

interface Props {
  storages: StorageWithSum[]
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
    <StorageForm onSubmit={async (name) => {
      const newStorage = await axios.post<Storage>("/api/storages", { name, userId: "hmm" });
      setStorages([...storages, { ...newStorage.data, sum: 0 }]);
    }} />
  </>
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const prisma = new PrismaClient();
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
      storages: storagesWithSum
    }
  }
};