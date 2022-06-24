import { PrismaClient, RecurringTransaction, RecurringTransactionFrequency } from "@prisma/client";
import axios from "axios";
import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../app/store";
import { Button } from "../../components/Button";
import { NoDataContainer } from "../../components/containers/NoDataContainer";
import { Money, MoneyHeaderCell } from "../../components/Money";
import { NewRecurringTransactionDialog } from "../../components/NewRecurringTransactionDialog";
import { PageHeader } from "../../components/PageHeader";
import { removeRecurringTransaction, setRecurringTransactions } from "../../features/recurringTransactionsSlice";
import { setSinks } from "../../features/sinksSlice";
import { setStorages } from "../../features/storagesSlice";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { ConvertDates } from "../../utils/types";

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

const TotalRow = styled.tr({
  fontWeight: "bold",
  height: 80
});

interface RecurringTransactionRowProps {
  recurringTransaction: ConvertDates<RecurringTransaction>,
  costs: { daily: number, weekly: number, monthly: number, yearly: number }
}

const RecurringTransactionRow = ({
  recurringTransaction,
  costs
}: RecurringTransactionRowProps) => {
  const [deleting, setDeleting] = useState(false);
  const dispatch = useDispatch();

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
      <Button
        loading={deleting}
        onClick={async () => {
          setDeleting(true);
          await axios.delete(`/api/recurringTransactions/${recurringTransaction.id}`);
          dispatch(removeRecurringTransaction(recurringTransaction.id));
        }}
      >
        Delete
      </Button>
    </td>
  </tr>;
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

  const totalCosts = recurringTransactions.reduce((acc, transaction) => {
    const { daily, weekly, monthly, yearly } = calculateRegularCosts(transaction.amount, transaction.frequency);
    return {
      daily: acc.daily + daily,
      weekly: acc.weekly + weekly,
      monthly: acc.monthly + monthly,
      yearly: acc.yearly + yearly
    };
  }, { daily: 0, weekly: 0, monthly: 0, yearly: 0 });

  return <div>
    <PageHeader
      title="Recurring transactions"
      button={<Button variant="filled" onClick={() => setDialogOpen(true)}>New recurring transaction</Button>}
    />
    <NewRecurringTransactionDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    {recurringTransactions.length > 0 ? <TransactionsTable>
      <thead>
        <tr>
          <th>Name</th>
          <th>Frequency</th>
          <MoneyHeaderCell>Price (daily)</MoneyHeaderCell>
          <MoneyHeaderCell>Price (weekly)</MoneyHeaderCell>
          <MoneyHeaderCell>Price (monthly)</MoneyHeaderCell>
          <MoneyHeaderCell>Price (yearly)</MoneyHeaderCell>
          <th>Category</th>
          <th>Next date</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {recurringTransactions.map(recurringTransaction => {
          const costs = calculateRegularCosts(recurringTransaction.amount, recurringTransaction.frequency);
          return <RecurringTransactionRow
            key={recurringTransaction.id}
            recurringTransaction={recurringTransaction}
            costs={costs}
          />;
        })}
        <TotalRow>
          <td>Total</td>
          <td />
          <Money<"td"> as="td" cents={totalCosts.daily} invertColor />
          <Money<"td"> as="td" cents={totalCosts.weekly} invertColor />
          <Money<"td"> as="td" cents={totalCosts.monthly} invertColor />
          <Money<"td"> as="td" cents={totalCosts.yearly} invertColor />
          <td />
          <td />
          <td />
        </TotalRow>
      </tbody>
    </TransactionsTable> : <NoDataContainer
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
