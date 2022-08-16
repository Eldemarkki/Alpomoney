import { SinkId } from "@alpomoney/shared";
import { useState } from "react";
import Select from "react-select/creatable";
import { useSinks } from "../../hooks/useSinks";

interface Props {
  id: string,
  onChange: (sinkId: SinkId | undefined) => void,
  defaultValue?: SinkId
}

export const SinkInput = (props: Props) => {
  const [selectedId, setSelectedId] = useState<SinkId | undefined>(props.defaultValue);
  const { sinks, createSink } = useSinks();

  const selected = sinks.find(s => s.id === selectedId);

  return <Select
    id={props.id}
    options={sinks.map(sink => ({
      label: sink.name,
      value: sink.id
    }))}
    value={selected ? { label: selected.name, value: selected.id } : undefined}
    onChange={sink => {
      if (sink) {
        setSelectedId(sink.value);
        props.onChange(sink.value);
      } else {
        setSelectedId(undefined);
        props.onChange(undefined);
      }
    }}
    placeholder="Select a sink"
    noOptionsMessage={() => "No sinks found"}
    formatCreateLabel={inputValue => `Create "${inputValue}"`}
    onCreateOption={async (inputValue: string) => {
      const newSink = await createSink(inputValue);
      setSelectedId(newSink.id);
      props.onChange(newSink.id);
      return { label: newSink.name, value: newSink.id };
    }}
  />;
};
