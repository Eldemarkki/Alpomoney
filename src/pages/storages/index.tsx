import { PrismaClient, Storage } from "@prisma/client";
import { useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { useDispatch, useSelector } from "react-redux";
import { removeStorage, setStorageBalances, setStorages } from "../../features/storagesSlice";
import { RootState } from "../../app/store";
import { InferGetServerSidePropsType } from "next";
import { NewStorageDialog } from "../../components/NewStorageDialog";
import { getRecurringMonthlyExpensesMultiple, getStorageBalances } from "../../utils/storageUtils";
import { Button } from "../../components/Button";
import { Money } from "../../components/Money";
import { Grid } from "../../components/Grid";
import axios from "axios";
import { NoDataContainer } from "../../components/containers/NoDataContainer";
import { PageHeader } from "../../components/PageHeader";
import { setTransactions } from "../../features/transactionsSlice";

export default function Storages(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [monthlyExpenses, setMonthlyExpenses] = useState(props.monthlyExpenses);

  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(setStorages(props.storages));
  }, [dispatch, props.storages]);

  useEffect(() => {
    dispatch(setStorageBalances(props.storageBalances));
  }, [dispatch, props.storageBalances]);

  useEffect(() => {
    dispatch(setTransactions(props.transactions));
  }, [dispatch, props.transactions]);

  const storages = useSelector((state: RootState) => state.storages.storages);
  const transactions = useSelector((state: RootState) => state.transactions.transactions);

  const totalSums: Record<string, number> = storages.reduce((acc, storage) => {
    const initial = storage.startAmount;
    const transactionsSum = transactions
      .filter(t => t.storageId === storage.id)
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      ...acc,
      [storage.id]: initial - transactionsSum
    };
  }, {});

  const now = new Date();
  const spentThisMonth: Record<string, number> = storages.reduce((acc, storage) => {
    const transactionsSum = transactions
      .filter(t => t.storageId === storage.id)
      .filter(t => {
        const createdAt = new Date(t.createdAt);
        return createdAt.getMonth() === now.getMonth() &&
          createdAt.getFullYear() === now.getFullYear();
      })
      .reduce((acc, t) => acc + t.amount, 0);
    return {
      ...acc,
      [storage.id]: transactionsSum
    };
  }, {});

  return <>
    <PageHeader
      title="Storages"
      button={<Button onClick={() => setDialogOpen(true)} variant="filled">New storage</Button>} />
    {storages.length > 0 &&
      <p>
        Total value: <Money<"span"> cents={Object.values(totalSums).reduce((prev, curr) => prev + curr, 0)} />
      </p>
    }
    <NewStorageDialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      onCreate={storage => {
        setMonthlyExpenses({ ...monthlyExpenses, [storage.id]: 0 });
      }}
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

    const storages = await prisma.storage.findMany({});

    const storageBalances = await getStorageBalances(storages.map(s => s.id), prisma);
    const monthlyExpenses = await getRecurringMonthlyExpensesMultiple(storages.map(s => s.id), prisma);
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id
      }
    });

    return {
      props: {
        storages,
        user,
        storageBalances,
        monthlyExpenses,
        transactions: transactions.map(t => ({
          ...t,
          createdAt: t.createdAt.getTime()
        }))
      }
    };
  },
  sessionSettings
);
