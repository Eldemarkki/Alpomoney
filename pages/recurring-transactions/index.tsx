import { PrismaClient } from "@prisma/client";
import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { NewRecurringTransactionDialog } from "../../components/NewRecurringTransactionDialog";
import { setRecurringTransactions } from "../../features/recurringTransactionsSlice";
import { setSinks } from "../../features/sinksSlice";
import { setStorages } from "../../features/storagesSlice";
import { sessionSettings } from "../../sessions/ironSessionSettings";

export default function RecurringTransactionsPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setRecurringTransactions(props.recurringTransactions));
  }, [dispatch, props.recurringTransactions]);

  useEffect(() => {
    dispatch(setStorages(props.storages));
  }, [dispatch, props.storages]);

  useEffect(() => {
    dispatch(setSinks(props.sinks));
  }, [dispatch, props.sinks]);

  const [modalOpen, setModalOpen] = useState(false);
  const recurringTransactions = useSelector((state: RootState) => state.recurringTransactions.recurringTransactions);

  return <div>
    <h1>Recurring transactions</h1>
    <button onClick={() => setModalOpen(true)}>
      New recurring transaction
    </button>
    <NewRecurringTransactionDialog open={modalOpen} onClose={() => setModalOpen(false)} />
    <table>
      <thead>
        <tr>
          <th style={{ paddingRight: 30 }}>Name</th>
          <th>Amount</th>
          <th>Frequency</th>
        </tr>
      </thead>
      <tbody>
        {recurringTransactions.map(recurringTransaction => <tr key={recurringTransaction.id}>
          <td>{recurringTransaction.name}</td>
          <td align='right'>{recurringTransaction.amount}€</td>
          <td>{recurringTransaction.frequency}</td>
        </tr>)}
      </tbody>
    </table>
  </div>;
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const prisma = new PrismaClient();
    const recurringTransactions = await prisma.recurringTransaction.findMany({
      where: {
        userId: req.session.user.id
      }
    });

    const sinks = await prisma.sink.findMany({});
    const storages = await prisma.storage.findMany({});

    return {
      props: {
        recurringTransactions,
        sinks,
        storages
      }
    }
  },
  sessionSettings
)