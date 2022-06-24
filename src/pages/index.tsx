import { PrismaClient } from "@prisma/client";
import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Grid } from "../components/Grid";
import { Money } from "../components/Money";
import { setSinks } from "../features/sinksSlice";
import { setStorages } from "../features/storagesSlice";
import { sessionSettings } from "../sessions/ironSessionSettings";

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSinks(props.sinks));
  });
  useEffect(() => {
    dispatch(setStorages(props.storages));
  });

  return <div>
    <h1>Dashboard</h1>
    <p>Welcome back, {props.user.name}</p>
    <div>
      <h2>My Storages</h2>
      <Grid
        rows={props.storages}
        columns={[
          {
            name: "Name",
            getter: storage => storage.name
          },
          {
            name: "Balance",
            headerAlignment: "right",
            cellRenderer: storage => <Money<"td"> as="td" cents={props.totalSums[storage.id]} />
          },
          {
            name: "Spent this month",
            headerAlignment: "right",
            cellRenderer: storage => <Money<"td"> as="td" cents={props.spentThisMonth[storage.id]} invertColor />
          }
        ]}
      />
    </div>
  </div>;
}

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  if (!req.session.user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    };
  }

  const prisma = new PrismaClient();

  const sinks = await prisma.sink.findMany({});

  const storages = await prisma.storage.findMany({
    where: {
      userId: req.session.user.id
    }
  });

  const totalSums: Record<string, number> = {};
  for (const storage of storages) {
    const sum = await prisma.transaction.aggregate({
      where: {
        storageId: storage.id
      },
      _sum: {
        amount: true
      }
    });
    totalSums[storage.id] = (storage.startAmount || 0) - (sum._sum.amount || 0);
  }

  const recurringMonthlyExpenses: Record<string, number> = {};
  for (const storage of storages) {
    const expenses = await prisma.recurringTransaction.aggregate({
      where: {
        storageId: storage.id
      },
      _sum: {
        amount: true
      }
    });
    recurringMonthlyExpenses[storage.id] = expenses._sum.amount || 0;
  }

  const spentThisMonth: Record<string, number> = {};
  for (const storage of storages) {
    const spent = await prisma.transaction.aggregate({
      where: {
        storageId: storage.id,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
        }
      },
      _sum: {
        amount: true
      }
    });
    spentThisMonth[storage.id] = spent._sum.amount || 0;
  }

  return {
    props: {
      sinks,
      storages,
      recurringMonthlyExpenses,
      spentThisMonth,
      totalSums,
      user: req.session.user
    }
  };
}, sessionSettings);