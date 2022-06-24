import { PrismaClient, Storage } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { useDispatch, useSelector } from "react-redux";
import { removeStorage, setStorages } from "../../features/storagesSlice";
import { RootState } from "../../app/store";
import { InferGetServerSidePropsType } from "next";
import { NewStorageDialog } from "../../components/NewStorageDialog";
import { getRecurringMonthlyExpensesMultiple, getTransactionSums } from "../../utils/storageUtils";
import { moneyToString } from "../../utils/moneyUtils";
import styled from "styled-components";
import { Button } from "../../components/Button";

const StoragesTable = styled.table({
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 32,
  "td": {
    borderTop: "1px solid #ccc",
    borderBottom: "1px solid #ccc",
    padding: "0px 4px"
  },
  "tr": {
    height: 48
  }
});

interface StorageTableRowProps {
  storage: Storage,
  sum: number,
  expenses: number
}

const StoragesTableRow = ({
  storage,
  sum,
  expenses
}: StorageTableRowProps) => {
  const dispatch = useDispatch();
  const [deleting, setDeleting] = useState(false);

  return <tr>
    <td>{storage.name}</td>
    <td>{moneyToString(sum)}</td>
    <td style={{ color: "red" }}>{moneyToString(expenses)}</td>
    <td align="right">
      <Button
        loading={deleting}
        onClick={async () => {
          setDeleting(true);
          await axios.delete(`/api/storages/${storage.id}`);
          dispatch(removeStorage(storage.id));
        }}>Delete</Button>
    </td>
  </tr>;
};

export default function Storages(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [totalSums, setTotalSums] = useState(props.totalSums);
  const [monthlyExpenses, setMonthlyExpenses] = useState(props.monthlyExpenses);

  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(setStorages(props.storages));
  }, [dispatch, props.storages]);

  const storages = useSelector((state: RootState) => state.storages.storages);

  return <>
    <h1>Storages</h1>
    <p>Total value: {moneyToString(Object.values(totalSums).reduce((prev, curr) => prev + curr, 0))}</p>
    <Button onClick={() => setDialogOpen(true)}>
      New storage
    </Button>
    <NewStorageDialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      onCreate={storage => {
        setTotalSums({ ...totalSums, [storage.id]: storage.startAmount });
        setMonthlyExpenses({ ...monthlyExpenses, [storage.id]: 0 });
      }}
    />
    <StoragesTable>
      <thead>
        <tr>
          <th style={{ paddingRight: 30 }}>Name</th>
          <th>Sum</th>
          <th>Monthly expenses</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {[...storages].sort((a, b) => totalSums[b.id] - totalSums[a.id]).map(storage =>
          <StoragesTableRow
            key={storage.id}
            storage={storage}
            expenses={monthlyExpenses[storage.id]}
            sum={totalSums[storage.id]}
          />
        )}
      </tbody>
    </StoragesTable>
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

    const totalSums = await getTransactionSums(storages.map(s => s.id), prisma);
    const monthlyExpenses = await getRecurringMonthlyExpensesMultiple(storages.map(s => s.id), prisma);

    return {
      props: {
        storages,
        user,
        totalSums,
        monthlyExpenses
      }
    };
  },
  sessionSettings
);
