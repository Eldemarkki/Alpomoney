import * as Dialog from '@radix-ui/react-dialog';
import { NewStorageForm } from './NewStorageForm';

interface Props {
  open: boolean,
  onClose: () => void
}

export const NewStorageDialog = (props: Props) => {
  return <Dialog.Root open={props.open} onOpenChange={(isOpen) => { if (!isOpen) props.onClose() }}>
    <Dialog.Overlay style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(39,39,39,0.7)",
    }} />
    <Dialog.Content style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "fit-content",
      height: "fit-content",
      padding: 50,
      background: "white",
      borderRadius: 15
    }}>
      <Dialog.Close style={{
        position: "fixed",
        right: 15,
        top: 15
      }}>
        Close
      </Dialog.Close>
      <Dialog.Title>New storage</Dialog.Title>
      <NewStorageForm onCreate={() => props.onClose()} />
    </Dialog.Content>
  </Dialog.Root>;
}