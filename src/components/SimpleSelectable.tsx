import React from "react";

import { Control, Controller, FieldValues } from "react-hook-form";
import { Field, ListCollection, Portal, Select } from "@chakra-ui/react";

export type SelectableItem = { label: string; value: string };

interface SimpleSelectableProps {
  name: string;
  collection: ListCollection<SelectableItem>;
  control: Control<FieldValues>;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  disable?: boolean;
}

function SimpleSelectable({
  label,
  name,
  collection,
  placeholder,
  defaultValue,
  disable,
  control,
}: SimpleSelectableProps) {
  disable ??= false;

  return (
    <Field.Root>
      {label && <Field.Label>{label}</Field.Label>}
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field }) => (
          <Select.Root
            name={field.name}
            disabled={disable}
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
            <Portal>
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
            </Portal>
          </Select.Root>
        )}
      />
    </Field.Root>
  );
}

export default SimpleSelectable;
