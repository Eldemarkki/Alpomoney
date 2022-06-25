import { Select, SelectProps } from "@mantine/core";
import { Storage } from "@prisma/client";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addStorage } from "../../features/storagesSlice";
import { ConvertDates } from "../../utils/types";
import { InputBaseStyles } from "./InputBase";

interface Props {
  storages: Storage[],
  onChange: (storageId: string) => void
}

export const StorageInput = ({
  storages,
  onChange,
  ...props
}: Props & Omit<SelectProps, "data" | "value" | "onChange">) => {
  const [selectedId, setSelectedId] = useState<string | null>(props.defaultValue);
  const dispatch = useDispatch();

  return <Select
    {...props}
    data={storages.map(storage => ({
      value: storage.id,
      label: storage.name
    }))}
    value={selectedId}
    onChange={id => {
      setSelectedId(id);
      onChange(id);
    }}
    creatable
    searchable
    placeholder="Select a storage"
    nothingFound="No storages"
    getCreateLabel={query => `+ Create ${query}`}
    onCreate={async storageName => {
      const response = await axios.post<ConvertDates<Storage>>("/api/storages", {
        name: storageName
      });
      dispatch(addStorage(response.data));
    }}
    styles={{
      defaultVariant: InputBaseStyles
    }}
  />;
};
