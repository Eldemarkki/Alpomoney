import * as RadixDialog from "@radix-ui/react-dialog";
import { PropsWithChildren } from "react";
import styled from "styled-components";
import { Button } from "./Button";

export const DialogOverlay = styled(RadixDialog.Overlay)({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(39, 39, 39, 0.7)",
  backdropFilter: "blur(2px)"
});

export const DialogContent = styled(RadixDialog.Content)({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "fit-content",
  height: "fit-content",
  padding: 50,
  background: "var(--background-color)",
  borderRadius: 15
});

export const DialogClose = () => <RadixDialog.Close
  asChild
  style={{
    position: "fixed",
    right: 15,
    top: 15
  }}>
  <Button>
    Close
  </Button>
</RadixDialog.Close>;

interface DialogProps {
  open: boolean,
  onClose: () => void,
  title: string
}

export const Dialog = (props: PropsWithChildren<DialogProps>) => {
  return <RadixDialog.Root open={props.open} onOpenChange={isOpen => { if (!isOpen) props.onClose(); }}>
    <DialogOverlay />
    <DialogContent>
      <DialogClose />
      <RadixDialog.Title>{props.title}</RadixDialog.Title>
      {props.children}
    </DialogContent>
  </RadixDialog.Root>;
};
