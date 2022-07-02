import { Grid } from "../components/Grid";
import { Money } from "../components/Money";
import { useStorages } from "../hooks/useStorages";
import { useTransactions } from "../hooks/useTransactions";
import { useUser } from "../hooks/useUser";
import { StorageId, Transaction } from "@alpomoney/shared";
import { groupBy, sumBy } from "../utils/collectionUtils";

export const DashboardPage = () => {
  const { user } = useUser();

  const { storages } = useStorages();
  const { transactions } = useTransactions();

  const storageTransactions: Record<StorageId, Transaction[]> = groupBy(transactions, t => t.storageId);
  const totalSums: Record<StorageId, number> = storages.reduce((acc, storage) => ({
    ...acc,
    [storage.id]: sumBy(storageTransactions[storage.id] || [], t => -t.amount) + storage.initialBalance
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
      [storage.id]: sumBy(storageTransactionsThisMonth[storage.id] || [], t => t.amount)
    };
  }, {});

  return <div>
    <h1>Dashboard</h1>
    <p>Welcome back, {user?.username}</p>
    <div>
      <h2>My Storages</h2>
      <Grid
        rows={storages}
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
            renderSum: sum => <Money cents={sum} />,
            sumValueGetter: storage => totalSums[storage.id]
          },
          {
            name: "Spent this month",
            textAlignment: "right",
            render: storage => <Money cents={spentThisMonth[storage.id]} invertColor />,
            sumValueGetter: storage => spentThisMonth[storage.id],
            renderSum: sum => <Money cents={sum} invertColor />
          }
        ]}
      />
    </div>
  </div>;
};
