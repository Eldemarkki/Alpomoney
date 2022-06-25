import { Select, SelectProps } from "@mantine/core";
import { Sink } from "@prisma/client";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addSink } from "../../features/sinksSlice";
import { ConvertDates } from "../../utils/types";
import { InputBaseStyles } from "./InputBase";

interface Props {
  sinks: Sink[],
  onChange: (sinkId: string) => void
}

export const SinkInput = ({
  sinks,
  onChange,
  ...props
}: Props & Omit<SelectProps, "data" | "value" | "onChange">) => {
  const [selectedId, setSelectedId] = useState<string | null>(props.defaultValue);
  const dispatch = useDispatch();

  return <Select
    {...props}
    data={sinks.map(sink => ({
      value: sink.id,
      label: sink.name
    }))}
    value={selectedId}
    onChange={id => {
      setSelectedId(id);
      onChange(id);
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
