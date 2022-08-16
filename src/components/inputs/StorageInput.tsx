import { StorageId } from "@alpomoney/shared";
import { useState } from "react";
import { useStorages } from "../../hooks/useStorages";
import Select from "react-select/creatable";

interface Props {
  id: string,
  onChange: (storageId: StorageId | undefined) => void,
  defaultValue?: StorageId
}

export const StorageInput = (props: Props) => {
  const [selectedId, setSelectedId] = useState<StorageId | undefined>(props.defaultValue);
  const { storages, createStorage } = useStorages();

  const selected = storages.find(s => s.id === selectedId);

  return <Select
    id={props.id}
    options={storages.map(storage => ({
      label: storage.name,
      value: storage.id
    }))}
    value={selected ? { label: selected.name, value: selected.id } : undefined}
    onChange={storage => {
      if (storage) {
        setSelectedId(storage.value);
        props.onChange(storage.value);
      } else {
        setSelectedId(undefined);
        props.onChange(undefined);
      }
    }}
    placeholder="Select a storage"
    noOptionsMessage={() => "No storages found"}
    formatCreateLabel={inputValue => `Create "${inputValue}"`}
    onCreateOption={async (inputValue: string) => {
      const newStorage = await createStorage(inputValue);
      setSelectedId(newStorage.id);
      props.onChange(newStorage.id);
      return { label: newStorage.name, value: newStorage.id };
    }}
  />;
};
