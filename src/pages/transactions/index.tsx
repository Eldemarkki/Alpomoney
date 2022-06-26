import { PrismaClient, Transaction } from "@prisma/client";
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
import { EditTransactionDialog } from "../../components/EditTransactionDialog";
import { ConvertDates } from "../../utils/types";

export default function TransactionsPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [transactions, setTransactions] = useState(props.transactions);
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<ConvertDates<Transaction> & {
    Sink: {
      name: string
    },
    Storage: {
      name: string
    }
  } | null>(null);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSinks(props.sinks));
  }, [dispatch, props.sinks]);
  useEffect(() => {
    dispatch(setStorages(props.storages));
  }, [dispatch, props.storages]);

  return <>
    <PageHeader
      title="Transactions"
      button={<Button variant="filled" onClick={() => setNewDialogOpen(true)}>New transaction</Button>}
    />
    <NewTransactionDialog
      open={newDialogOpen}
      onClose={() => setNewDialogOpen(false)}
      onCreate={transaction => setTransactions([...transactions, transaction])}
    />
    <EditTransactionDialog
      transaction={editTransaction}
      open={editDialogOpen}
      onClose={() => setEditDialogOpen(false)}
      onUpdate={transaction => {
        const index = transactions.findIndex(t => t.id === transaction.id);
        if (index !== -1) {
          const newTransactions = [...transactions];
          newTransactions[index] = transaction;
          setTransactions(newTransactions);
        }
      }}
    />
    {transactions.length > 0 ? <Grid
      rows={transactions}
      deleteRow={async transaction => {
        await axios.delete(`/api/transactions/${transaction.id}`);
        setTransactions(transactions.filter(t => t.id !== transaction.id));
      }}
      editRow={transaction => {
        setEditTransaction(transaction);
        setEditDialogOpen(true);
      }}
      columns={[
        {
          name: "Description",
          render: transaction => transaction.description || <i>No description</i>,
          sumName: "Sum"
        },
        {
          name: "Amount",
          textAlignment: "right",
          render: transaction => <Money cents={transaction.amount} invertColor />,
          sumValueGetter: transaction => transaction.amount,
          renderSum: sum => <Money cents={sum} invertColor />
        },
        {
          name: "Sink",
          render: transaction => transaction.Sink ? transaction.Sink.name : <i>Unknown sink</i>
        },
        {
          name: "Storage",
          render: transaction => transaction.Storage ? transaction.Storage.name : <i>Unknown storage</i>
        },
        {
          name: "Created at",
          render: transaction => new Date(transaction.createdAt).toLocaleString()
        }
      ]}
    /> : <NoDataContainer
      text="No transactions. Create a new one by clicking the button below!"
      buttonText="New transaction"
      onClick={() => setNewDialogOpen(true)}
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


