import { Storage } from "@alpomoney/shared";
import { Dialog } from "./Dialog";
import { NewStorageForm } from "./NewStorageForm";

interface Props {
  open: boolean,
  onClose: () => void,
  onCreate?: (storage: Storage) => void
}

export const NewStorageDialog = (props: Props) => {
  return <Dialog
    open={props.open}
    onClose={props.onClose}
    title="New storage"
  >
    <NewStorageForm onCreate={storage => {
      if (props.onCreate) {
        props.onCreate(storage);
      }
      props.onClose();
    }} />
  </Dialog>;
};
