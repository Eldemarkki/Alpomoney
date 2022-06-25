import styled from "styled-components";

const TextInputComponent = styled.input({
  border: "1px solid grey",
  borderRadius: 5,
  padding: "5px 10px",
  width: "100%",
  height: 35
});

interface TextInputProps {
  onChange?: (value: string) => void
}

type NormalProps = TextInputProps & Omit<React.ComponentPropsWithoutRef<"input">, "onChange">;

export const TextInput = ({
  onChange,
  ...props
}: NormalProps) => {
  return <TextInputComponent
    onChange={e => onChange && onChange(e.target.value)}
    {...props}
  />;
};
