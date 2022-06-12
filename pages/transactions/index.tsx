import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { useDispatch } from 'react-redux'
import { setSinks } from "../../features/sinksSlice";
import { setStorages } from "../../features/storagesSlice";
import { NewTransactionForm } from "../../components/NewTransactionForm";
import { getStoragesWithSum } from "../../utils/storageUtils";

export default function TransactionsPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [transactions, setTransactions] = useState(props.transactions);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSinks(props.sinks));
  });
  useEffect(() => {
    dispatch(setStorages(props.storages));
  });

  return <>
    <h1>Transactions</h1>
    <NewTransactionForm onCreate={transaction => setTransactions([...transactions, transaction])} />
    <table style={{ marginTop: 30 }}>
      <thead>
        <tr>
          <th>Amount</th>
          <th>Description</th>
          <th>Sink</th>
          <th>Storage</th>
          <th>Created at</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(transaction => <tr key={transaction.id}>
          <td>{transaction.amount}€</td>
          <td>{transaction.description || <i>No description</i>}</td>
          <td>{transaction.Sink ? transaction.Sink.name : <i>Unknown sink</i>}</td>
          <td>{transaction.Storage ? transaction.Storage.name : <i>Unknown storage</i>}</td>
          <td>{new Date(transaction.createdAt).toLocaleString()}</td>
          <td><button onClick={async () => {
            await axios.delete(`/api/transactions/${transaction.id}`);
            setTransactions(transactions.filter(t => t.id !== transaction.id));
          }}>Delete</button></td>
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

  const storagesWithSum = await getStoragesWithSum(storages, prisma);

  const returnValue = {
    props: {
      transactions: transactions.map(t => ({ ...t, createdAt: t.createdAt.getTime() })),
      user,
      sinks,
      storages: storagesWithSum
    }
  };
  return returnValue;
}, sessionSettings);


