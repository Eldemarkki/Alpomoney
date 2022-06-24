import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { useDispatch } from "react-redux";
import { setSinks } from "../../features/sinksSlice";
import { setStorages } from "../../features/storagesSlice";
import { Button } from "../../components/Button";
import { Money } from "../../components/Money";
import { NewTransactionDialog } from "../../components/NewTransactionDialog";
import { PageHeader } from "../../components/PageHeader";
import { NoDataContainer } from "../../components/containers/NoDataContainer";
import { Grid } from "../../components/Grid";

export default function TransactionsPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [transactions, setTransactions] = useState(props.transactions);
  const [dialogOpen, setDialogOpen] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSinks(props.sinks));
  });
  useEffect(() => {
    dispatch(setStorages(props.storages));
  });

  return <>
    <PageHeader
      title="Transactions"
      button={<Button variant="filled" onClick={() => setDialogOpen(true)}>New transaction</Button>}
    />
    <NewTransactionDialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      onCreate={transaction => setTransactions([...transactions, transaction])}
    />
    {transactions.length > 0 ? <Grid
      rows={transactions}
      deleteRow={async transaction => {
        await axios.delete(`/api/transactions/${transaction.id}`);
        setTransactions(transactions.filter(t => t.id !== transaction.id));
      }}
      columns={[
        {
          name: "Amount",
          headerAlignment: "right",
          cellRenderer: transaction => <Money<"td"> as="td" cents={transaction.amount} invertColor />
        },
        {
          name: "Description",
          getter: transaction => transaction.description || <i>No description</i>
        },
        {
          name: "Sink",
          getter: transaction => transaction.Sink ? transaction.Sink.name : <i>Unknown sink</i>
        },
        {
          name: "Storage",
          getter: transaction => transaction.Storage ? transaction.Storage.name : <i>Unknown storage</i>
        },
        {
          name: "Created at",
          getter: transaction => new Date(transaction.createdAt).toLocaleString()
        }
      ]}
    /> : <NoDataContainer
      text="No transactions. Create a new one by clicking the button below!"
      buttonText="New transaction"
      onClick={() => setDialogOpen(true)}
    />}
  </>;
}

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
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
    }
  });

  const returnValue = {
    props: {
      transactions: transactions.map(t => ({ ...t, createdAt: t.createdAt.getTime() })),
      sinks,
      storages
    }
  };
  return returnValue;
}, sessionSettings);


