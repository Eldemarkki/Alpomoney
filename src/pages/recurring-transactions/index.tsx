import { PrismaClient, RecurringTransactionFrequency } from "@prisma/client";
import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../app/store";
import { Button } from "../../components/Button";
import { Money } from "../../components/Money";
import { NewRecurringTransactionDialog } from "../../components/NewRecurringTransactionDialog";
import { setRecurringTransactions } from "../../features/recurringTransactionsSlice";
import { setSinks } from "../../features/sinksSlice";
import { setStorages } from "../../features/storagesSlice";
import { sessionSettings } from "../../sessions/ironSessionSettings";

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const calculateRegularCosts = (cost: number, frequency: RecurringTransactionFrequency) => {
  if (frequency === "DAILY") {
    return {
      daily: cost,
      weekly: cost * 7,
      monthly: cost * 30,
      yearly: cost * 365
    };
  } else if (frequency === "WEEKLY") {
    return {
      daily: cost / 7,
      weekly: cost,
      monthly: cost * 4,
      yearly: cost * 52
    };
  } else if (frequency === "MONTHLY") {
    return {
      daily: cost / 30,
      weekly: cost / 4,
      monthly: cost,
      yearly: cost * 12
    };
  } else if (frequency === "YEARLY") {
    return {
      daily: cost / 365,
      weekly: cost / 52,
      monthly: cost / 12,
      yearly: cost
    };
  }

  assertNever(frequency);
};

const formatFrequency = (frequency: RecurringTransactionFrequency) => {
  if (frequency === "DAILY") {
    return "Daily";
  } else if (frequency === "WEEKLY") {
    return "Weekly";
  } else if (frequency === "MONTHLY") {
    return "Monthly";
  } else if (frequency === "YEARLY") {
    return "Yearly";
  }
  assertNever(frequency);
};

const TransactionsTable = styled.table({
  marginTop: 30,
  width: "100%"
});

export default function RecurringTransactionsPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setRecurringTransactions(props.recurringTransactions));
  }, [dispatch, props.recurringTransactions]);

  useEffect(() => {
    dispatch(setStorages(props.storages));
  }, [dispatch, props.storages]);

  useEffect(() => {
    dispatch(setSinks(props.sinks));
  }, [dispatch, props.sinks]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const recurringTransactions = useSelector((state: RootState) => state.recurringTransactions.recurringTransactions);

  return <div>
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h1>Recurring transactions</h1>
      <Button
        variant="filled"
        onClick={() => setDialogOpen(true)}
      >
        New recurring transaction
      </Button>
    </div>
    <NewRecurringTransactionDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    {recurringTransactions.length > 0 ? <TransactionsTable>
      <thead>
        <tr>
          <th>Name</th>
          <th>Frequency</th>
          <th>Price (daily)</th>
          <th>Price (weekly)</th>
          <th>Price (monthly)</th>
          <th>Price (yearly)</th>
          <th>Category</th>
          <th>Next date</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {recurringTransactions.map(recurringTransaction => {
          const costs = calculateRegularCosts(recurringTransaction.amount, recurringTransaction.frequency);
          return <tr key={recurringTransaction.id}>
            <td>{recurringTransaction.name}</td>
            <td>{formatFrequency(recurringTransaction.frequency)}</td>
            <Money<"td"> as="td" cents={costs.daily} invertColor />
            <Money<"td"> as="td" cents={costs.weekly} invertColor />
            <Money<"td"> as="td" cents={costs.monthly} invertColor />
            <Money<"td"> as="td" cents={costs.yearly} invertColor />
            <td>{recurringTransaction.category}</td>
            <td>{new Date(recurringTransaction.startDate).toLocaleDateString()}</td>
            <td>
              <Button onClick={async () => {
                await axios.delete(`/api/recurringTransactions/${recurringTransaction.id}`);
                // TODO: Create action `deleteRecurringTransaction`
                const newTransactions = recurringTransactions.filter(rt => rt.id !== recurringTransaction.id);
                dispatch(setRecurringTransactions(newTransactions));
              }}>
                Delete
              </Button>
            </td>
          </tr>;
        })}
      </tbody>
    </TransactionsTable> : <div style={{
      minHeight: 300,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column"
    }}>
      <p>No recurring transactions. Create a new one by clicking the button below!</p>
      <Button
        variant="filled"
        onClick={() => setDialogOpen(true)}
      >
        Create
      </Button>
    </div>}
  </div>;
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
    const recurringTransactions = await prisma.recurringTransaction.findMany({
      where: {
        userId: user.id
      }
    });

    const sinks = await prisma.sink.findMany({});
    const storages = await prisma.storage.findMany({});

    return {
      props: {
        recurringTransactions: recurringTransactions.map(rt => ({ ...rt, startDate: rt.startDate.getTime() })),
        sinks,
        storages
      }
    };
  },
  sessionSettings
);
