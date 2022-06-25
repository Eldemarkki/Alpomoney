import { Transaction } from "@prisma/client";
import { ConvertDates } from "../utils/types";
import { Dialog } from "./Dialog";
import { EditTransactionForm } from "./EditTransactionForm";

interface Props {
  transaction: ConvertDates<Transaction> & {
    Sink: {
      name: string
    },
    Storage: {
      name: string
    }
  },
  open: boolean,
  onClose: () => void,
  onUpdate?: (transaction: ConvertDates<Transaction> & {
    Sink: {
      name: string
    },
    Storage: {
      name: string
    }
  }) => void
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
        onUpdate(transaction);
        onClose();
      }}
    />
  </Dialog>;
};
