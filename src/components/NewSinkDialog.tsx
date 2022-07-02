import { Sink } from "@alpomoney/shared";
import { Dialog } from "./Dialog";
import { NewSinkForm } from "./NewSinkForm";

interface Props {
  open: boolean,
  onClose: () => void,
  onCreate?: (sink: Sink) => void
}

export const NewSinkDialog = (props: Props) => {
  return <Dialog
    open={props.open}
    onClose={props.onClose}
    title="New sink"
  >
    <NewSinkForm onCreate={sink => {
      if (props.onCreate) {
        props.onCreate(sink);
      }
      if (props.onClose) {
        props.onClose();
      }
    }} />
  </Dialog>;
};
