import { PropsWithChildren } from "react";
import styled from "styled-components";
import { Property } from "csstype";
import { TransientProps } from "../utils/types";

type ButtonVariant = "primary" | "filled" | "transparent"

interface ButtonProps {
  loading?: boolean,
  fullWidth?: boolean,
  variant?: ButtonVariant,
  extraPadding?: boolean,
  textColor?: Property.Color
}

type TransientButtonProps = TransientProps<ButtonProps>

const ButtonComponent = styled.button<TransientButtonProps>(props => ({
  border: "1px solid black",
  borderWidth: 1,
  borderStyle: "solid",
  borderRadius: 12,
  borderColor: ({
    primary: "var(--primary)",
    filled: "var(--primary)",
    transparent: "var(--primary)"
  }[props.$variant]),
  padding: props.$extraPadding ? "16px 32px" : "8px 16px",
  cursor: "pointer",
  width: props.$fullWidth ? "100%" : "auto",
  backgroundColor: ({
    primary: "rgb(145, 202, 253)",
    filled: "var(--primary)",
    transparent: "transparent"
  }[props.$variant]),
  color: props.$textColor ? props.$textColor : ({
    primary: "var(--primary)",
    filled: "white",
    transparent: "var(--primary)"
  }[props.$variant])
}));

export const Button = ({
  children,
  variant = "transparent",
  loading,
  fullWidth,
  extraPadding,
  textColor,
  ...rest
}: PropsWithChildren<ButtonProps & React.ComponentPropsWithoutRef<"button">>) => {
  return <ButtonComponent
    disabled={loading}
    $variant={variant}
    $fullWidth={fullWidth}
    $extraPadding={extraPadding}
    $textColor={textColor}
    {...rest}
  >
    {children}
  </ButtonComponent>;
};
