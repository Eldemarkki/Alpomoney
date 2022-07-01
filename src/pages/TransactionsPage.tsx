import { Transaction } from "../types";
import axios from "axios";
import { useState } from "react";
import { Button } from "../components/Button";
import { Money } from "../components/Money";
import { NewTransactionDialog } from "../components/NewTransactionDialog";
import { PageHeader } from "../components/PageHeader";
import { NoDataContainer } from "../components/containers/NoDataContainer";
import { Grid } from "../components/Grid";
import { EditTransactionDialog } from "../components/EditTransactionDialog";
import { ConvertDates } from "../utils/types";
import { useTransactions } from "../hooks/useTransactions";
import { useStorages } from "../hooks/useStorages";

export default function TransactionsPage() {
  const { transactions } = useTransactions();
  const { storages } = useStorages();
  // const {sinks} = useSink

  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<ConvertDates<Transaction> | null>(null);

  return <>
    <PageHeader
      title="Transactions"
      button={<Button variant="filled" onClick={() => setNewDialogOpen(true)}>New transaction</Button>}
    />
    <NewTransactionDialog
      open={newDialogOpen}
      onClose={() => setNewDialogOpen(false)}
      onCreate={transaction => {
        console.log(transaction);
      }}
    />
    <EditTransactionDialog
      transaction={editTransaction}
      open={editDialogOpen}
      onClose={() => setEditDialogOpen(false)}
      onUpdate={transaction => {
        // const index = transactions.findIndex(t => t.id === transaction.id);
        // if (index !== -1) {
        //   const newTransactions = [...transactions];
        //   newTransactions[index] = transaction;
        //   setTransactions(newTransactions);
        // }
      }}
    />
    {transactions.length > 0 ? <Grid
      rows={transactions}
      deleteRow={async transaction => {
        // await axios.delete(`/api/transactions/${transaction.id}`);
        // setTransactions(transactions.filter(t => t.id !== transaction.id));
      }}
      editRow={transaction => {
        setEditTransaction({
          ...transaction,
          createdAt: transaction.createdAt.getTime()
        });
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
          render: transaction => transaction.sinkId ? transaction.sinkId : <i>Unknown sink</i>
        },
        {
          name: "Storage",
          render: transaction => transaction.storageId ? transaction.storageId : <i>Unknown storage</i>
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
