import { PropsWithChildren } from "react";
import styled from "styled-components";

const ButtonComponent = styled.button({
  border: "1px solid black",
  borderRadius: 12,
  height: 32,
  padding: "0px 16px",
  cursor: "pointer"
});

interface ButtonProps {
  loading?: boolean
}

export const Button = (props: PropsWithChildren<ButtonProps & React.ComponentPropsWithoutRef<"button">>) => {
  const { children, loading, ...rest } = props;
  return <ButtonComponent disabled={loading} {...rest}>
    {children}
  </ButtonComponent>;
};
