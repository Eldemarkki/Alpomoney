import styled from "styled-components";
import { Property } from "csstype";
import { TransientProps } from "../utils/types";
import { Spinner } from "./Spinner";
import { forwardRef } from "react";
import { themeVariables } from "../theme/variables";

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
  borderWidth: themeVariables.borderWidths.xs,
  borderStyle: "solid",
  borderRadius: themeVariables.borderRadiuses.lg,
  borderColor: ({
    primary: themeVariables.colors.primary,
    filled: themeVariables.colors.primary,
    transparent: themeVariables.colors.primary
  }[props.$variant || "transparent"]),
  padding: props.$extraPadding
    ? `${themeVariables.sizes.md} ${themeVariables.sizes.xl}`
    : `${themeVariables.sizes.xs} ${themeVariables.sizes.md}`,
  cursor: "pointer",
  width: props.$fullWidth ? "100%" : "auto",
  backgroundColor: ({
    primary: "rgb(145, 202, 253)",
    filled: themeVariables.colors.primary,
    transparent: "transparent"
  }[props.$variant || "transparent"]),
  color: props.$textColor ? props.$textColor : ({
    primary: themeVariables.colors.primary,
    filled: "white",
    transparent: themeVariables.colors.primary
  }[props.$variant || "transparent"]),
  display: "flex",
  justifyContent: "center"
}));

export const Button = forwardRef<HTMLButtonElement, React.PropsWithChildren<ButtonProps &
  React.ComponentPropsWithoutRef<"button">>>(({
    loading,
    extraPadding,
    variant = "transparent",
    fullWidth,
    textColor,
    ...props
  }, ref) => (
    <ButtonComponent
      disabled={loading}
      $extraPadding={extraPadding}
      $variant={variant}
      $fullWidth={fullWidth}
      $textColor={textColor}
      $loading={loading}
      ref={ref}
      {...props}
    >
      {loading ? <Spinner size={15} color="white" /> : props.children}
    </ButtonComponent>
  ));
