import { ComponentPropsWithoutRef, useState } from "react";
import styled from "styled-components";

const NumberChangeButton = styled.button<{ side: "up" | "down" }>(props => ({
  width: "100%",
  padding: 0,
  height: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
  borderTop: props.side === "down" ? "1px solid grey" : "none",
  borderCollapse: "collapse"
}));

const Container = styled.div({
  display: "flex",
  width: 350,
  position: "relative",
  alignItems: "center"
});

const Input = styled.input({
  width: "100%",
  height: 35,
  border: "none",
  paddingLeft: 10
});

const ChangeButtonsContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  right: 0,
  width: 20,
  borderLeft: "1px solid grey"
});

interface NumberInputProps {
  initialValue?: number,
  onChange?: (value: number) => void,
  step?: number,
  precision?: number
}

type NormalProps = Omit<ComponentPropsWithoutRef<"input">, "onChange" | "step">;

export const NumberInput = ({
  initialValue = 0,
  step = 1,
  precision = 2,
  onChange,
  ...props
}: NormalProps & NumberInputProps) => {
  const [value, setValue] = useState(initialValue.toFixed(precision));

  const handleChange = (newValue: number) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  return <Container>
    <Input
      {...props}
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={e => {
        const newValue = Number(e.target.value);
        if (isNaN(newValue)) {
          setValue("0");
          handleChange(0);
        }
        else {
          setValue(newValue.toFixed(precision));
          handleChange(newValue);
        }
      }}
    />
    <ChangeButtonsContainer>
      <NumberChangeButton
        side="up"
        type="button"
        onClick={() => {
          const newValue = Number(value) + step;
          setValue(newValue.toFixed(precision));
          handleChange(Number(newValue.toFixed(precision)));
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 10L8 6L12 10" stroke="grey" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </NumberChangeButton>
      <NumberChangeButton
        side="down"
        type="button"
        onClick={() => {
          const newValue = Number(value) - step;
          setValue(newValue.toFixed(precision));
          handleChange(Number(newValue.toFixed(precision)));
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6L8 10L4 6" stroke="grey" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </NumberChangeButton>
    </ChangeButtonsContainer>
  </Container>;
};
