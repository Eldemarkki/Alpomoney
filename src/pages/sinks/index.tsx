import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { useDispatch, useSelector } from "react-redux";
import { removeSink, setSinks } from "../../features/sinksSlice";
import { RootState } from "../../app/store";
import { InferGetServerSidePropsType } from "next";
import { Button } from "../../components/Button";
import { Grid } from "../../components/Grid";
import { PageHeader } from "../../components/PageHeader";
import { NewSinkDialog } from "../../components/NewSinkDialog";
import { NoDataContainer } from "../../components/containers/NoDataContainer";

export default function SinksPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const sinks = useSelector((state: RootState) => state.sinks.sinks);
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(setSinks(props.sinks));
  }, [dispatch, props.sinks]);

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
          getter: sink => sink.name
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

    return {
      props: {
        sinks,
        user
      }
    };
  },
  sessionSettings
);
