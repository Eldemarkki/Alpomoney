import { PrismaClient } from '@prisma/client';
import { withIronSessionSsr } from 'iron-session/next';
import { InferGetServerSidePropsType } from 'next'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NewTransactionDialog } from '../components/NewTransactionDialog';
import { setSinks } from '../features/sinksSlice';
import { setStorages } from '../features/storagesSlice';
import { sessionSettings } from '../sessions/ironSessionSettings';
import { moneyToString } from '../utils/moneyUtils';

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSinks(props.sinks));
  });
  useEffect(() => {
    dispatch(setStorages(props.storages));
  });

  return <div>
    <h1>Dashboard</h1>
    <button onClick={() => setDialogOpen(true)}>
      New transaction
    </button>
    <NewTransactionDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    <div>
      <h2>My Storages</h2>
      <table>
        <thead>
          <tr>
            <th style={{ paddingRight: 30 }}>Name</th>
            <th>Sum</th>
            <th>Spent this month</th>
          </tr>
        </thead>
        <tbody>
          {[...props.storages].sort((a, b) => props.totalSums[b.id] - props.totalSums[a.id]).map(storage => <tr key={storage.id}>
            <td>{storage.name}</td>
            <td align='right'>{moneyToString(props.totalSums[storage.id])}</td>
            <td align="right" style={{ color: "red" }}>{moneyToString(-props.spentThisMonth[storage.id])}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
  </div>
}

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  if (!req.session.user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    }
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
        storageId: storage.id,
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
        storageId: storage.id,
      },
      _sum: {
        amount: true
      }
    })
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
      totalSums
    }
  }
}, sessionSettings);
