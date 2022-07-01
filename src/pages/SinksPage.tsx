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

export default function SinksPage() {
  const { sinks } = useSinks();

  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);

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
        // {
        //   name: "Total spendings",
        //   sumValueGetter: sink => transactionSums[sink.id] || 0,
        //   render: sink => <Money cents={transactionSums[sink.id]} invertColor />,
        //   textAlignment: "right",
        //   renderSum: sum => <Money cents={sum} invertColor />
        // },
        // {
        //   name: "Last 30 days",
        //   render: sink => <Money cents={transactionSums30Days[sink.id]} invertColor />,
        //   textAlignment: "right",
        //   sumValueGetter: sink => transactionSums30Days[sink.id] || 0,
        //   renderSum: sum => <Money cents={sum} invertColor />
        // }
      ]}
    /> : <NoDataContainer
      text="No sinks. Create a new one by clicking the button below!"
      buttonText="Create new sink"
      onClick={() => setDialogOpen(true)}
    />}
  </>;
}
