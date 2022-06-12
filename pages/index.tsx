import { PrismaClient } from '@prisma/client';
import { withIronSessionSsr } from 'iron-session/next';
import { InferGetServerSidePropsType } from 'next'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NewTransactionDialog } from '../components/NewTransactionDialog';
import { setSinks } from '../features/sinksSlice';
import { setStorages } from '../features/storagesSlice';
import { sessionSettings } from '../sessions/ironSessionSettings';
import { getStoragesWithSum } from '../utils/storageUtils';

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
          </tr>
        </thead>
        <tbody>
          {[...props.storages].sort((a, b) => b.sum - a.sum).map(storage => <tr key={storage.id}>
            <td>{storage.name}</td>
            <td align='right'>{storage.sum}€</td>
          </tr>)}
        </tbody>
      </table>
    </div>
  </div>
}

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
  const prisma = new PrismaClient();

  const sinks = await prisma.sink.findMany({});

  const storages = await prisma.storage.findMany({
    where: {
      userId: req.session.user.id
    }
  });

  const storagesWithSum = await getStoragesWithSum(storages, prisma);

  return {
    props: {
      sinks,
      storages: storagesWithSum
    }
  }
}, sessionSettings);
