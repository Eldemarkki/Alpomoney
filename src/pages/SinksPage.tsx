import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { removeSink } from "../features/sinksSlice";
import { Button } from "../components/Button";
import { Grid } from "../components/Grid";
import { PageHeader } from "../components/PageHeader";
import { NewSinkDialog } from "../components/NewSinkDialog";
import { NoDataContainer } from "../components/containers/NoDataContainer";
import { Money } from "../components/Money";
import { useSinks } from "../hooks/useSinks";
import { useTransactions } from "../hooks/useTransactions";
import { groupBy, sumBy } from "../utils/collectionUtils";
import { SinkId, Transaction } from "@alpomoney/shared";

export default function SinksPage() {
  const { sinks } = useSinks();
  const { transactions } = useTransactions();

  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);

  const sinkTransactions: Record<SinkId, Transaction[]> =
    groupBy(transactions, transaction => transaction.sinkId);

  const totalSums: Record<SinkId, number> = sinks.reduce((acc, sink) => ({
    ...acc,
    [sink.id]: sumBy(sinkTransactions[String(sink.id) as SinkId] || [], t => -t.amount)
  }), {});

  const sinkTransactionsThisMonth: Record<SinkId, Transaction[]> = groupBy(
    transactions.filter(transaction =>
      transaction.createdAt.getMonth() === new Date().getMonth() &&
      transaction.createdAt.getFullYear() === new Date().getFullYear()),
    transaction => transaction.sinkId
  );
  const spentThisMonth: Record<SinkId, number> = sinks.reduce((acc, sink) => ({
    ...acc,
    [sink.id]: sumBy(sinkTransactionsThisMonth[sink.id] || [], t => -t.amount)
  }), {});
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
          sumValueGetter: sink => totalSums[sink.id] || 0,
          render: sink => <Money cents={-totalSums[sink.id]} invertColor />,
          textAlignment: "right",
          renderSum: sum => <Money cents={-sum} invertColor />
        },
        {
          name: "Last 30 days",
          render: sink => <Money cents={-spentThisMonth[sink.id]} invertColor />,
          textAlignment: "right",
          sumValueGetter: sink => spentThisMonth[sink.id] || 0,
          renderSum: sum => <Money cents={-sum} invertColor />
        }
      ]}
    /> : <NoDataContainer
      text="No sinks. Create a new one by clicking the button below!"
      buttonText="Create new sink"
      onClick={() => setDialogOpen(true)}
    />}
  </>;
}
