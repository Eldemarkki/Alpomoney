import { Select, SelectProps } from "@mantine/core";
import { Sink, SinkId } from "../../types";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addSink } from "../../features/sinksSlice";
import { ConvertDates } from "../../utils/types";
import { InputBaseStyles } from "./InputBase";

interface Props {
  sinks: Sink[],
  onChange: (sinkId: SinkId | undefined) => void
}

export const SinkInput = ({
  sinks,
  onChange,
  ...props
}: Props & Omit<SelectProps, "data" | "value" | "onChange">) => {
  const [selectedId, setSelectedId] = useState<SinkId | null>(props.defaultValue as SinkId | null);
  const dispatch = useDispatch();

  return <Select
    {...props}
    data={sinks.map(sink => ({
      value: sink.id,
      label: sink.name
    }))}
    value={selectedId}
    onChange={(id: SinkId | null) => {
      setSelectedId(id);
      onChange(id || undefined);
    }}
    creatable
    searchable
    placeholder="Select a sink"
    nothingFound="No sinks"
    getCreateLabel={query => `+ Create ${query}`}
    onCreate={async sinkName => {
      const response = await axios.post<ConvertDates<Sink>>("/api/sinks", {
        name: sinkName
      });
      dispatch(addSink(response.data));
    }}
    styles={{
      defaultVariant: InputBaseStyles
    }}
  />;
};
