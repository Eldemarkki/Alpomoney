import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { useDispatch, useSelector } from "react-redux";
import { removeSink, setSinks, setSpendingLast30Days, setTotalSpendings } from "../../features/sinksSlice";
import { RootState } from "../../app/store";
import { InferGetServerSidePropsType } from "next";
import { Button } from "../../components/Button";
import { Grid } from "../../components/Grid";
import { PageHeader } from "../../components/PageHeader";
import { NewSinkDialog } from "../../components/NewSinkDialog";
import { NoDataContainer } from "../../components/containers/NoDataContainer";
import { addMonths } from "date-fns";
import { Money } from "../../components/Money";

export default function SinksPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const sinks = useSelector((state: RootState) => state.sinks.sinks);
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(setSinks(props.sinks));
  }, [dispatch, props.sinks]);

  useEffect(() => {
    dispatch(setTotalSpendings(props.transactionSums));
  }, [dispatch, props.transactionSums]);

  useEffect(() => {
    dispatch(setSpendingLast30Days(props.transactionSums30Days));
  }, [dispatch, props.transactionSums30Days]);

  const transactionSums = useSelector((state: RootState) => state.sinks.totalSpendings);
  const transactionSums30Days = useSelector((state: RootState) => state.sinks.totalSpendingsLast30Days);

  return <>
    <PageHeader
      title="Sinks"
      button={<Button onClick={() => setDialogOpen(true)} variant="filled">Add sink</Button>} />
    <NewSinkDialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
    />
    {sinks.length > 0 ? <Grid
      rows={sinks}
      deleteRow={async sink => {
        await axios.delete(`/api/sinks/${sink.id}`);
        dispatch(removeSink(sink.id));
      }}
      columns={[
        {
          name: "Name",
          render: sink => sink.name,
          sumName: "Sum"
        },
        {
          name: "Total spendings",
          sumValueGetter: sink => transactionSums[sink.id] || 0,
          render: sink => <Money cents={transactionSums[sink.id]} invertColor />,
          textAlignment: "right",
          renderSum: sum => <Money cents={sum} invertColor />
        },
        {
          name: "Last 30 days",
          render: sink => <Money cents={transactionSums30Days[sink.id]} invertColor />,
          textAlignment: "right",
          sumValueGetter: sink => transactionSums30Days[sink.id] || 0,
          renderSum: sum => <Money cents={sum} invertColor />
        }
      ]}
    /> : <NoDataContainer
      text="No sinks. Create a new one by clicking the button below!"
      buttonText="Create new sink"
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

    const sinks = await prisma.sink.findMany({});

    const transactionSums: Record<string, number> = {};
    for (const sink of sinks) {
      const transactionSum = await prisma.transaction.aggregate({
        where: {
          sinkId: sink.id
        },
        _sum: {
          amount: true
        }
      });
      transactionSums[sink.id] = transactionSum._sum.amount || 0;
    }

    const transactionSums30Days: Record<string, number> = {};
    for (const sink of sinks) {
      const transactions = await prisma.transaction.aggregate({
        where: {
          sinkId: sink.id,
          createdAt: {
            gte: addMonths(new Date(), -1)
          }
        },
        _sum: {
          amount: true
        }
      });
      transactionSums30Days[sink.id] = transactions._sum.amount || 0;
    }

    return {
      props: {
        sinks,
        user,
        transactionSums,
        transactionSums30Days
      }
    };
  },
  sessionSettings
);
