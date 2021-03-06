import * as RadixDialog from "@radix-ui/react-dialog";
import { PropsWithChildren } from "react";
import styled from "styled-components";
import { themeVariables } from "../theme/variables";
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
  paddingTop: 10,
  background: themeVariables.colors.background,
  borderRadius: 15
});

const DialogHeader = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 10,
  marginBottom: 20
});

export const DialogClose = () => <RadixDialog.Close asChild>
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
      <DialogHeader>
        <RadixDialog.Title>{props.title}</RadixDialog.Title>
        <DialogClose />
      </DialogHeader>
      {props.children}
    </DialogContent>
  </RadixDialog.Root>;
};
