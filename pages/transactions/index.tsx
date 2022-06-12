import { PrismaClient, Transaction } from "@prisma/client";
import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { RootState } from '../../app/store'
import { useDispatch, useSelector } from 'react-redux'
import { setSinks } from "../../features/sinksSlice";
import { setStorages } from "../../features/storagesSlice";
import { ConvertDates } from "../../utils/types";

export default function TransactionsPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [transactions, setTransactions] = useState(props.transactions);

  const availableSinks = useSelector((state: RootState) => state.sinks.sinks);
  const availableStorages = useSelector((state: RootState) => state.storages.storages);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSinks(props.sinks));
  });
  useEffect(() => {
    dispatch(setStorages(props.storages));
  });

  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [sinkId, setSinkId] = useState(undefined);
  const [storageId, setStorageId] = useState(undefined);

  return <>
    <h1>Transactions</h1>
    <form onSubmit={async (e) => {
      e.preventDefault();
      const response = await axios.post<ConvertDates<Transaction>>("/api/transactions", {
        amount,
        description,
        sinkId,
        storageId
      });
      setTransactions([...transactions, {
        ...response.data,
        Sink: {
          name: availableSinks.find(sink => sink.id === response.data.sinkId)?.name,
        },
        Storage: {
          name: availableStorages.find(storage => storage.id === response.data.storageId)?.name,
        },
        createdAt: new Date(response.data.createdAt).getTime(),
      }]);
    }}>
      <label htmlFor="amount">Amount</label>
      <input type="number" id="amount" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      <label htmlFor="description">Description</label>
      <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <label htmlFor="sinkId">Sink</label>
      <select id="sinkId" value={sinkId} onChange={(e) => setSinkId(e.target.value)}>
        <option value={undefined}>Select a sink</option>
        {availableSinks.map(sink => <option key={sink.id} value={sink.id}>{sink.name}</option>)}
      </select>
      <label htmlFor="storageId">Storage</label>
      <select id="storageId" value={storageId} onChange={(e) => setStorageId(e.target.value)}>
        <option value={undefined}>Select a storage</option>
        {availableStorages.map(storage => <option key={storage.id} value={storage.id}>{storage.name}</option>)}
      </select>
      <button type="submit">Create</button>
    </form>
    <table style={{ marginTop: 30 }}>
      <thead>
        <tr>
          <th>Amount</th>
          <th>Description</th>
          <th>Sink</th>
          <th>Storage</th>
          <th>Created at</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(transaction => <tr key={transaction.id}>
          <td>{transaction.amount}€</td>
          <td>{transaction.description || <i>No description</i>}</td>
          <td>{transaction.Sink.name}</td>
          <td>{transaction.Storage.name}</td>
          <td>{new Date(transaction.createdAt).toLocaleString()}</td>
        </tr>)}
      </tbody>
    </table>
  </>;
}

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  const user = req.session.user;

  const prisma = new PrismaClient();

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: user.id
    },
    include: {
      Sink: {
        select: {
          name: true
        }
      },
      Storage: {
        select: {
          name: true
        }
      }
    }
  });

  const sinks = await prisma.sink.findMany({});

  const storages = await prisma.storage.findMany({
    where: {
      userId: user.id
    },
  });

  const returnValue = {
    props: {
      transactions: transactions.map(t => ({ ...t, createdAt: t.createdAt.getTime() })),
      user,
      sinks,
      storages
    }
  };
  return returnValue;
}, sessionSettings);


