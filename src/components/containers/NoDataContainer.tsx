import styled from "styled-components";
import { Button } from "../Button";

const Container = styled.div({
  minHeight: 300,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column"
});

interface NoDataContainerProps {
  text: string,
  buttonText?: string,
  onClick?: () => void
}

export const NoDataContainer = (props: NoDataContainerProps) => {
  return <Container>
    <p>{props.text}</p>
    {props.buttonText && props.onClick && <Button
      variant="filled"
      onClick={() => props.onClick && props.onClick()}>
      {props.buttonText}
    </Button>}
  </Container>;
};
