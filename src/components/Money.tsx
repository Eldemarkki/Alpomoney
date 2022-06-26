import React, { ElementType } from "react";
import styled from "styled-components";
import { moneyToString } from "../utils/moneyUtils";

interface MoneyProps {
  as?: ElementType,
  cents: number,
  invertColor?: boolean,
  alignRight?: boolean
}

const Component = styled.span<MoneyProps>(props => {
  const colors = ["green", "red"];

  return ({
    color: props.invertColor ?
      colors[props.cents < 0 ? 0 : 1] :
      colors[props.cents < 0 ? 1 : 0],
    textAlign: (props.as === "td" || props.alignRight) ? "right" : "left"
  });
});

export const Money = <T extends ElementType = "span">({
  as: asComponent = "span",
  cents = 0,
  invertColor = false,
  alignRight = false,
  ...props
}: MoneyProps & React.ComponentPropsWithoutRef<T>) => {
  return <Component
    as={asComponent}
    cents={cents}
    invertColor={invertColor}
    alignRight={alignRight}
    {...props}
  >
    {moneyToString(cents)}
  </Component>;
};

export const MoneyHeaderCell = styled.th({
  textAlign: "right"
});
