import { Field, Input, ListCollection, Select } from "@chakra-ui/react";
import React, { useState } from "react";
import { SelectableItem } from "./SimpleSelectable";
import { Control, Controller, FieldValues } from "react-hook-form";

interface SearchSelectableProps {
  name: string;
  label: string;
  placeholder: string;
  defaultValue: (any & SelectableItem)[];
  collection: ListCollection<any & SelectableItem>;
  control: Control<FieldValues>;
  disable: boolean;
}

function SearchSelectable({
  name,
  label,
  collection,
  defaultValue,
  placeholder,
  control,
  disable,
}: SearchSelectableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  disable ??= false;

  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field }) => (
          <Select.Root
            name={field.name}
            collection={collection}
            onValueChange={({ items }) => {
              field.onChange(items);
            }}
            multiple
            defaultValue={defaultValue.map((item) => item.value)}
            disabled={disable}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder={placeholder} />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Select.Positioner>
              <Select.Content>
                <Input
                  placeholder={placeholder}
                  autoFocus
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                  }}
                />
                {collection.items
                  .filter((item) => item.label.includes(searchTerm))
                  .map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        )}
      />
    </Field.Root>
  );
}

export default SearchSelectable;
