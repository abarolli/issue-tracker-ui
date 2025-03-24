import React from "react";

import { Control, Controller, FieldValues } from "react-hook-form";
import { Field, ListCollection, Select } from "@chakra-ui/react";

export type SelectableItem = { label: string; value: string };

interface SimpleSelectableProps {
  label: string;
  name: string;
  collection: ListCollection<SelectableItem>;
  placeholder?: string;
  defaultValue?: string;
  control?: Control<FieldValues>;
}

function SimpleSelectable({
  label,
  name,
  collection,
  placeholder,
  defaultValue,
  control,
}: SimpleSelectableProps) {
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
            onValueChange={({ value }) => field.onChange(value[0])}
            defaultValue={[field.value]}
            collection={collection}
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
                {collection.items.map((item) => (
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

export default SimpleSelectable;
