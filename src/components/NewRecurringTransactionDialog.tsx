import { Dialog } from "./Dialog";
import { NewRecurringTransactionForm } from "./NewRecurringTransactionForm";

interface Props {
  open: boolean,
  onClose: () => void
}

export const NewRecurringTransactionDialog = (props: Props) => {
  return <Dialog
    open={props.open}
    onClose={props.onClose}
    title="New recurring transaction"
  >
    <NewRecurringTransactionForm onCreate={() => props.onClose()} />
  </Dialog>;
};
