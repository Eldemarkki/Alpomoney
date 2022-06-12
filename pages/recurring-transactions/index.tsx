import { PrismaClient, RecurringTransactionFrequency } from "@prisma/client";
import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { NewRecurringTransactionDialog } from "../../components/NewRecurringTransactionDialog";
import { setRecurringTransactions } from "../../features/recurringTransactionsSlice";
import { setSinks } from "../../features/sinksSlice";
import { setStorages } from "../../features/storagesSlice";
import { sessionSettings } from "../../sessions/ironSessionSettings";

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
}

const calculateRegularCosts = (cost: number, frequency: RecurringTransactionFrequency) => {
  if (frequency === "DAILY") {
    return {
      daily: cost,
      weekly: cost * 7,
      monthly: cost * 30,
      yearly: cost * 365
    }
  } else if (frequency === "WEEKLY") {
    return {
      daily: cost / 7,
      weekly: cost,
      monthly: cost * 4,
      yearly: cost * 52
    }
  } else if (frequency === "MONTHLY") {
    return {
      daily: cost / 30,
      weekly: cost / 4,
      monthly: cost,
      yearly: cost * 12
    }
  } else if (frequency === "YEARLY") {
    return {
      daily: cost / 365,
      weekly: cost / 52,
      monthly: cost / 12,
      yearly: cost
    }
  }

  assertNever(frequency);
}

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
}

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

  const [modalOpen, setModalOpen] = useState(false);
  const recurringTransactions = useSelector((state: RootState) => state.recurringTransactions.recurringTransactions);

  return <div>
    <h1>Recurring transactions</h1>
    <button onClick={() => setModalOpen(true)}>
      New recurring transaction
    </button>
    <NewRecurringTransactionDialog open={modalOpen} onClose={() => setModalOpen(false)} />
    <table>
      <thead>
        <tr>
          <th style={{ paddingRight: 30 }}>Name</th>
          <th>Frequency</th>
          <th>Price (daily)</th>
          <th>Price (weekly)</th>
          <th>Price (monthly)</th>
          <th>Price (yearly)</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {recurringTransactions.map(recurringTransaction => {
          const costs = calculateRegularCosts(recurringTransaction.amount, recurringTransaction.frequency)
          return <tr key={recurringTransaction.id}>
            <td>{recurringTransaction.name}</td>
            <td>{formatFrequency(recurringTransaction.frequency)}</td>
            <td>{costs.daily}€</td>
            <td>{costs.weekly}€</td>
            <td>{costs.monthly}€</td>
            <td>{costs.yearly}€</td>
            <td><button onClick={async () => {
              await axios.delete(`/api/recurringTransactions/${recurringTransaction.id}`)
              dispatch(setRecurringTransactions(recurringTransactions.filter(rt => rt.id !== recurringTransaction.id)))
            }}>Delete</button></td>
          </tr>;
        })}
      </tbody>
    </table>
  </div>;
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const prisma = new PrismaClient();
    const recurringTransactions = await prisma.recurringTransaction.findMany({
      where: {
        userId: req.session.user.id
      }
    });

    const sinks = await prisma.sink.findMany({});
    const storages = await prisma.storage.findMany({});

    return {
      props: {
        recurringTransactions,
        sinks,
        storages
      }
    }
  },
  sessionSettings
)