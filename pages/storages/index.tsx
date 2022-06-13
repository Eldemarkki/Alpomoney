import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionSettings } from "../../sessions/ironSessionSettings";
import { useDispatch, useSelector } from "react-redux";
import { removeStorage, setStorages } from "../../features/storagesSlice";
import { RootState } from "../../app/store";
import { InferGetServerSidePropsType } from "next";
import { NewStorageDialog } from "../../components/NewStorageDialog";
import { getStoragesWithSum } from "../../utils/storageUtils";
import { moneyToString } from "../../utils/moneyUtils";

export default function Storages(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(setStorages(props.storages));
  }, [dispatch, props.storages]);

  const storages = useSelector((state: RootState) => state.storages.storages);

  return <>
    <h1>Storages</h1>
    <p>Total value: {moneyToString(storages.reduce((prev, curr) => prev + curr.sum, 0))}</p>
    <button onClick={() => setDialogOpen(true)}>
      New storage
    </button>
    <NewStorageDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    <table>
      <thead>
        <tr>
          <th style={{ paddingRight: 30 }}>Name</th>
          <th>Sum</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {[...storages].sort((a, b) => b.sum - a.sum).map(storage => <tr key={storage.id}>
          <td>{storage.name}</td>
          <td align='right'>{moneyToString(storage.sum)}</td>
          <td>
            <button onClick={async () => {
              await axios.delete(`/api/storages/${storage.id}`);
              dispatch(removeStorage(storage.id));
            }}>Delete</button>
          </td>
        </tr>)}
      </tbody>
    </table>
  </>
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    const prisma = new PrismaClient();

    const storages = await prisma.storage.findMany({});

    const storagesWithSum = await getStoragesWithSum(storages, prisma);

    return {
      props: {
        storages: storagesWithSum,
        user: user
      }
    }
  },
  sessionSettings
);
