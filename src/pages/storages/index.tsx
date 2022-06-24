import { PrismaClient, Storage } from "@prisma/client";
import { useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { useDispatch, useSelector } from "react-redux";
import { removeStorage, setStorages } from "../../features/storagesSlice";
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

export default function Storages(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [totalSums, setTotalSums] = useState(props.storageBalances);
  const [monthlyExpenses, setMonthlyExpenses] = useState(props.monthlyExpenses);

  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(setStorages(props.storages));
  }, [dispatch, props.storages]);

  const storages = useSelector((state: RootState) => state.storages.storages);

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
        setTotalSums({ ...totalSums, [storage.id]: storage.startAmount });
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
          getter: storage => storage.name
        },
        {
          name: "Balance",
          headerAlignment: "right",
          cellRenderer: storage => <Money<"td"> as="td" cents={totalSums[storage.id]} />
        },
        {
          name: "Monthly expenses",
          headerAlignment: "right",
          cellRenderer: storage => <Money<"td"> as="td" cents={monthlyExpenses[storage.id]} invertColor />
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

    return {
      props: {
        storages,
        user,
        storageBalances,
        monthlyExpenses
      }
    };
  },
  sessionSettings
);
