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
import styled from "styled-components";
import { Money, MoneyHeaderCell } from "../../components/Money";
import { NewTransactionDialog } from "../../components/NewTransactionDialog";
import { PageHeader } from "../../components/PageHeader";
import { NoDataContainer } from "../../components/containers/NoDataContainer";
import { ConvertDates } from "../../utils/types";

const TransactionsTable = styled.table({
  marginTop: 30,
  width: "100%"
});

interface TransactionRowProps {
  transaction: ConvertDates<Transaction> & {
    Sink: {
      name: string
    },
    Storage: {
      name: string
    }
  },
  removeTransaction: (id: string) => void
}

const TransactionRow = ({ transaction, removeTransaction }: TransactionRowProps) => {
  const [deleting, setDeleting] = useState(false);

  return <tr>
    <Money<"td"> as="td" cents={transaction.amount} invertColor />
    <td>{transaction.description || <i>No description</i>}</td>
    <td>{transaction.Sink ? transaction.Sink.name : <i>Unknown sink</i>}</td>
    <td>{transaction.Storage ? transaction.Storage.name : <i>Unknown storage</i>}</td>
    <td>{new Date(transaction.createdAt).toLocaleString()}</td>
    <td align="right">
      <Button
        loading={deleting}
        onClick={async () => {
          setDeleting(true);
          await axios.delete(`/api/transactions/${transaction.id}`);
          removeTransaction(transaction.id);
        }}
      >
        Delete
      </Button>
    </td>
  </tr>;
};

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
    {transactions.length > 0 ? <TransactionsTable>
      <thead>
        <tr>
          <MoneyHeaderCell>Amount</MoneyHeaderCell>
          <th>Description</th>
          <th>Sink</th>
          <th>Storage</th>
          <th>Created at</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {transactions.map(transaction => <TransactionRow
          key={transaction.id}
          transaction={transaction}
          removeTransaction={id => setTransactions(transactions.filter(t => t.id !== id))}
        />)}
      </tbody>
    </TransactionsTable> : <NoDataContainer
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


