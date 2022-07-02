import { Transaction } from "@alpomoney/shared";
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
import { useSinks } from "../hooks/useSinks";

export default function TransactionsPage() {
  const { transactions, deleteTransaction } = useTransactions();
  const { storages } = useStorages();
  const { sinks } = useSinks();

  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTransaction, setEditTransaction] = useState<ConvertDates<Transaction> | null>(null);

  return <>
    <PageHeader
      title="Transactions"
      button={<Button variant="filled" onClick={() => setNewDialogOpen(true)}>New transaction</Button>}
    />
    <NewTransactionDialog
      open={newDialogOpen}
      onClose={() => setNewDialogOpen(false)}
    />
    {editingTransaction && <EditTransactionDialog
      transaction={editingTransaction}
      open={editDialogOpen}
      onClose={() => setEditDialogOpen(false)}
    />}
    {transactions.length > 0 ? <Grid
      rows={transactions}
      deleteRow={row => deleteTransaction(row.id)}
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
          render: transaction => sinks.find(s => s.id === transaction.sinkId)?.name ?? <i>Unknown sink</i>
        },
        {
          name: "Storage",
          render: transaction => storages.find(s => s.id === transaction.storageId)?.name ?? <i>Unknown storage</i>
        }
      ]}
    /> : <NoDataContainer
      text="No transactions. Create a new one by clicking the button below!"
      buttonText="New transaction"
      onClick={() => setNewDialogOpen(true)}
    />}
  </>;
}
