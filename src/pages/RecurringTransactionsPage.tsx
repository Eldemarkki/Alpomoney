import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../components/Button";
import { NoDataContainer } from "../components/containers/NoDataContainer";
import { Grid } from "../components/Grid";
import { Money } from "../components/Money";
import { NewRecurringTransactionDialog } from "../components/NewRecurringTransactionDialog";
import { PageHeader } from "../components/PageHeader";
import { removeRecurringTransaction } from "../features/recurringTransactionsSlice";
import { useRecurringTransactions } from "../hooks/useRecurringTransactions";
import { RecurringTransactionFrequency } from "@alpomoney/shared";

type RecurringCosts = Record<RecurringTransactionFrequency, number>;

export const calculateRecurringCosts = (cost: number, frequency: RecurringTransactionFrequency): RecurringCosts => {
  if (frequency === "daily") {
    return {
      daily: cost,
      weekly: cost * 7,
      monthly: cost * 30,
      yearly: cost * 365
    };
  } else if (frequency === "weekly") {
    return {
      daily: cost / 7,
      weekly: cost,
      monthly: cost * 4,
      yearly: cost * 52
    };
  } else if (frequency === "monthly") {
    return {
      daily: cost / 30,
      weekly: cost / 4,
      monthly: cost,
      yearly: cost * 12
    };
  } else if (frequency === "yearly") {
    return {
      daily: cost / 365,
      weekly: cost / 52,
      monthly: cost / 12,
      yearly: cost
    };
  }
  throw new Error("Unknown frequency");
};

const formatFrequency = (frequency: RecurringTransactionFrequency) => {
  if (frequency === "daily") {
    return "Daily";
  } else if (frequency === "weekly") {
    return "Weekly";
  } else if (frequency === "monthly") {
    return "Monthly";
  } else if (frequency === "yearly") {
    return "Yearly";
  }
  throw new Error("Unknown frequency");
};

export default function RecurringTransactionsPage() {
  const dispatch = useDispatch();

  const { recurringTransactions } = useRecurringTransactions();

  const [dialogOpen, setDialogOpen] = useState(false);

  const transactionCosts: Record<string, RecurringCosts> = recurringTransactions.reduce((acc, transaction) => {
    const { frequency, amount } = transaction;
    const costs = calculateRecurringCosts(amount, frequency);
    return {
      ...acc,
      [transaction.id]: costs
    };
  }, {});

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
          render: transaction => transaction.name,
          sumName: "Sum"
        },
        {
          name: "Frequency",
          render: transaction => formatFrequency(transaction.frequency)
        },
        {
          name: "Daily",
          render: transaction => <Money cents={transactionCosts[transaction.id].daily} invertColor />,
          sumValueGetter: transaction => transactionCosts[transaction.id].daily,
          renderSum: sum => <Money cents={sum} invertColor />
        },
        {
          name: "Weekly",
          render: transaction => <Money cents={transactionCosts[transaction.id].weekly} invertColor />,
          sumValueGetter: transaction => transactionCosts[transaction.id].weekly,
          renderSum: sum => <Money cents={sum} invertColor />
        },
        {
          name: "Monthly",
          render: transaction => <Money cents={transactionCosts[transaction.id].monthly} invertColor />,
          sumValueGetter: transaction => transactionCosts[transaction.id].monthly,
          renderSum: sum => <Money cents={sum} invertColor />
        },
        {
          name: "Yearly",
          render: transaction => <Money cents={transactionCosts[transaction.id].yearly} invertColor />,
          sumValueGetter: transaction => transactionCosts[transaction.id].yearly,
          renderSum: sum => <Money cents={sum} invertColor />
        },
        {
          name: "Category",
          render: transaction => transaction.category
        },
        {
          name: "Start date",
          render: transaction => new Date(transaction.startDate).toLocaleDateString()
        }
      ]}
    /> : <NoDataContainer
      text="No recurring transactions. Create a new one by clicking the button below!"
      buttonText="Create"
      onClick={() => setDialogOpen(true)}
    />}
  </div>;
}
