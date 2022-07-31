import styled from "styled-components";
import { themeVariables } from "../../theme/variables";

export const InputBaseStyles = {
  border: `${themeVariables.borderWidths.xs} solid grey`,
  borderRadius: themeVariables.borderRadiuses.lg,
  padding: `${themeVariables.sizes.xxs} ${themeVariables.sizes.xs}`,
  width: "100%",
  height: 35
};

export const InputBase = styled.input(InputBaseStyles);
