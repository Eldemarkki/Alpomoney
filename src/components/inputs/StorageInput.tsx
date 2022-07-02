import { Select, SelectProps } from "@mantine/core";
import { Storage, StorageId } from "@alpomoney/shared";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addStorage } from "../../features/storagesSlice";
import { ConvertDates } from "../../utils/types";
import { InputBaseStyles } from "./InputBase";

interface Props {
  storages: Storage[],
  onChange: (storageId: StorageId | undefined) => void
}

export const StorageInput = ({
  storages,
  onChange,
  ...props
}: Props & Omit<SelectProps, "data" | "value" | "onChange">) => {
  const [selectedId, setSelectedId] = useState<StorageId | null>(props.defaultValue as StorageId | null);
  const dispatch = useDispatch();

  return <Select
    {...props}
    data={storages.map(storage => ({
      value: storage.id,
      label: storage.name
    }))}
    value={selectedId}
    onChange={(id: StorageId | null) => {
      setSelectedId(id);
      onChange(id || undefined);
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
