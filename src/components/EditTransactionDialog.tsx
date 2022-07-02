import { Transaction } from "@alpomoney/shared";
import { ConvertDates } from "../utils/types";
import { Dialog } from "./Dialog";
import { EditTransactionForm } from "./EditTransactionForm";

interface Props {
  transaction: ConvertDates<Transaction>,
  open: boolean,
  onClose: () => void
}

export const EditTransactionDialog = ({
  transaction,
  open,
  onClose
}: Props) => {
  return <Dialog
    open={open}
    onClose={onClose}
    title="Edit transaction"
  >
    <EditTransactionForm transaction={transaction} onUpdate={() => { onClose(); }} />
  </Dialog>;
};
