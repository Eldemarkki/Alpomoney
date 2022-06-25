import { InputBase } from "./InputBase";

interface TextInputProps {
  onChange?: (value: string) => void
}

type NormalProps = TextInputProps & Omit<React.ComponentPropsWithoutRef<"input">, "onChange">;

export const TextInput = ({
  onChange,
  ...props
}: NormalProps) => {
  return <InputBase
    onChange={e => onChange && onChange(e.target.value)}
    {...props}
  />;
};
