import { NewTransactionForm } from "./NewTransactionForm";
import { Dialog } from "./Dialog";
import { ConvertDates } from "../utils/types";
import { Transaction } from "@prisma/client";

interface Props {
  open: boolean,
  onClose: () => void,
  onCreate: (transaction: ConvertDates<Transaction> & {
    Sink: {
      name: string
    },
    Storage: {
      name: string
    }
  }) => void
}

export const NewTransactionDialog = (props: Props) => {
  return <Dialog
    open={props.open}
    onClose={props.onClose}
    title="New transaction"
  >
    <NewTransactionForm onCreate={transaction => {
      props.onCreate(transaction);
      return props.onClose();
    }} />
  </Dialog>;
};