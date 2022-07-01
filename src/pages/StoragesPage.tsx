import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeStorage, setStorageBalances, setStorages } from "../features/storagesSlice";
import { RootState } from "../app/store";
import { NewStorageDialog } from "../components/NewStorageDialog";
import { Button } from "../components/Button";
import { Money } from "../components/Money";
import { Grid } from "../components/Grid";
import axios from "axios";
import { NoDataContainer } from "../components/containers/NoDataContainer";
import { PageHeader } from "../components/PageHeader";
import { setTransactions } from "../features/transactionsSlice";
import { Storage, StorageId, Transaction } from "../types";
import { useStorages } from "../hooks/useStorages";
import { groupBy, sumBy } from "../utils/collectionUtils";
import { useTransactions } from "../hooks/useTransactions";

export default function StoragesPage() {
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { storages } = useStorages();
  const { transactions } = useTransactions();

  const storageTransactions: Record<StorageId, Transaction[]> = groupBy(transactions, transaction => transaction.storageId);
  const totalSums: Record<StorageId, number> = storages.reduce((acc, storage) => ({
    ...acc,
    [storage.id]: sumBy(storageTransactions[storage.id] || [], t => -t.amount)
  }), {});

  const storageTransactionsThisMonth: Record<StorageId, Transaction[]> = groupBy(
    transactions.filter(transaction =>
      transaction.createdAt.getMonth() === new Date().getMonth() &&
      transaction.createdAt.getFullYear() === new Date().getFullYear()),
    transaction => transaction.storageId
  );
  const spentThisMonth: Record<StorageId, number> = storages.reduce((acc, storage) => {
    return {
      ...acc,
      [storage.id]: sumBy(storageTransactionsThisMonth[storage.id] || [], t => -t.amount)
    };
  }, {});

  const monthlyExpenses: Record<StorageId, number> = storages.reduce((acc, storage) => {
    return {
      ...acc,
      [storage.id]: 0
    };
  }, {});

  return <>
    <PageHeader
      title="Storages"
      button={<Button onClick={() => setDialogOpen(true)} variant="filled">New storage</Button>} />
    {storages.length > 0 &&
      <p>
        Total value: <Money<"span"> cents={sumBy(transactions, t => -t.amount)} />
      </p>
    }
    <NewStorageDialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
    />
    {storages.length > 0 ? <Grid<Storage>
      rows={[...storages].sort((a, b) => totalSums[b.id] - totalSums[a.id])}
      deleteRow={async storage => {
        await axios.delete(`/api/storages/${storage.id}`);
        dispatch(removeStorage(storage.id));
      }}
      columns={[
        {
          name: "Name",
          render: storage => storage.name,
          sumName: "Sum"
        },
        {
          name: "Balance",
          textAlignment: "right",
          render: storage => <Money cents={totalSums[storage.id]} />,
          sumValueGetter: storage => totalSums[storage.id],
          renderSum: sum => <Money cents={sum} />
        },
        {
          name: "Spent this month",
          textAlignment: "right",
          render: storage => <Money cents={spentThisMonth[storage.id]} invertColor />,
          sumValueGetter: storage => spentThisMonth[storage.id],
          renderSum: sum => <Money cents={sum} invertColor />
        },
        {
          name: "Monthly recurring expenses",
          textAlignment: "right",
          render: storage => <Money cents={monthlyExpenses[storage.id]} invertColor />,
          sumValueGetter: storage => monthlyExpenses[storage.id],
          renderSum: sum => <Money cents={sum} invertColor />
        }
      ]}
    /> : <NoDataContainer
      text="No storages. Create a new one by clicking the button below!"
      buttonText="Create new storage"
      onClick={() => setDialogOpen(true)}
    />}
  </>;
}

