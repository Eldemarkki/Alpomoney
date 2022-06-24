import { PrismaClient, RecurringTransactionFrequency } from "@prisma/client";
import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Button } from "../../components/Button";
import { NoDataContainer } from "../../components/containers/NoDataContainer";
import { Grid } from "../../components/Grid";
import { Money } from "../../components/Money";
import { NewRecurringTransactionDialog } from "../../components/NewRecurringTransactionDialog";
import { PageHeader } from "../../components/PageHeader";
import { removeRecurringTransaction, setRecurringTransactions } from "../../features/recurringTransactionsSlice";
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
    <PageHeader
      title="Recurring transactions"
      button={<Button variant="filled" onClick={() => setDialogOpen(true)}>New recurring transaction</Button>}
    />
    <NewRecurringTransactionDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    {recurringTransactions.length > 0 ? <Grid
      rows={recurringTransactions}
      deleteRow={async recurringTransaction => {
        await axios.delete(`/api/recurringTransactions/${recurringTransaction.id}`);
        dispatch(removeRecurringTransaction(recurringTransaction.id));
      }}
      columns={[
        {
          name: "Name",
          getter: transaction => transaction.name
        },
        {
          name: "Frequency",
          getter: transaction => formatFrequency(transaction.frequency)
        },
        {
          name: "Daily",
          cellRenderer: transaction =>
            <Money<"td">
              as="td"
              cents={calculateRegularCosts(transaction.amount, transaction.frequency).daily} invertColor />
        },
        {
          name: "Weekly",
          cellRenderer: transaction =>
            <Money<"td">
              as="td"
              cents={calculateRegularCosts(transaction.amount, transaction.frequency).weekly} invertColor />
        },
        {
          name: "Monthly",
          cellRenderer: transaction =>
            <Money<"td">
              as="td"
              cents={calculateRegularCosts(transaction.amount, transaction.frequency).monthly} invertColor />
        },
        {
          name: "Yearly",
          cellRenderer: transaction =>
            <Money<"td">
              as="td"
              cents={calculateRegularCosts(transaction.amount, transaction.frequency).yearly} invertColor />
        },
        {
          name: "Category",
          getter: transaction => transaction.category
        },
        {
          name: "Start date",
          getter: transaction => new Date(transaction.startDate).toLocaleDateString()
        }
      ]}
    /> : <NoDataContainer
      text="No recurring transactions. Create a new one by clicking the button below!"
      buttonText="Create"
      onClick={() => setDialogOpen(true)}
    />}
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
