import { Transaction } from "../types";
import { ConvertDates } from "../utils/types";
import { Dialog } from "./Dialog";
import { EditTransactionForm } from "./EditTransactionForm";

interface Props {
  transaction: ConvertDates<Transaction>,
  open: boolean,
  onClose: () => void,
  onUpdate?: (transaction: ConvertDates<Transaction>) => void
}

export const EditTransactionDialog = ({
  transaction,
  open,
  onClose,
  onUpdate
}: Props) => {
  return <Dialog
    open={open}
    onClose={onClose}
    title="Edit transaction"
  >
    <EditTransactionForm
      transaction={transaction}
      onUpdate={transaction => {
        if (onUpdate) {
          onUpdate(transaction);
        }
        onClose();
      }}
    />
  </Dialog>;
};
