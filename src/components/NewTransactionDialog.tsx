import { NewTransactionForm } from "./NewTransactionForm";
import { Dialog } from "./Dialog";

interface Props {
  open: boolean,
  onClose: () => void
}

export const NewTransactionDialog = (props: Props) => {
  return <Dialog
    open={props.open}
    onClose={props.onClose}
    title="New transaction"
  >
    <NewTransactionForm onCreate={() => props.onClose()} />
  </Dialog>;
};
