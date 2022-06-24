import { PropsWithChildren } from "react";
import styled from "styled-components";

const ButtonComponent = styled.button<{
  fullWidth?: boolean,
  primary?: boolean,
  extraPadding?: boolean
}>(props => ({
  border: "1px solid black",
  borderRadius: 12,
  padding: props.extraPadding ? "16px 32px" : "8px 16px",
  cursor: "pointer",
  width: props.fullWidth ? "100%" : "auto",
  backgroundColor: props.primary ? "rgb(145, 202, 253)" : "white"
}));

interface ButtonProps {
  loading?: boolean,
  fullWidth?: boolean,
  primary?: boolean,
  extraPadding?: boolean
}

export const Button = (props: PropsWithChildren<ButtonProps & React.ComponentPropsWithoutRef<"button">>) => {
  const {
    children,
    loading,
    fullWidth,
    primary,
    extraPadding,
    ...rest
  } = props;

  return <ButtonComponent
    disabled={loading}
    fullWidth={fullWidth}
    primary={primary}
    extraPadding={extraPadding}
    {...rest}>
    {children}
  </ButtonComponent>;
};
