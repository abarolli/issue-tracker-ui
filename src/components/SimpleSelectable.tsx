import { ListCollection, Select } from "@chakra-ui/react";
import React from "react";

export type SelectableItem = { label: string; value: string };

interface SimpleSelectableProps {
  label: string;
  collection: ListCollection<SelectableItem>;
  placeholder?: string;
  defaultValue?: string;
}

function SimpleSelectable({
  label,
  collection,
  placeholder,
  defaultValue,
}: SimpleSelectableProps) {
  return (
    <Select.Root collection={collection} defaultValue={[defaultValue || ""]}>
      <Select.HiddenSelect />
      <Select.Label>{label}</Select.Label>
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
  );
}

export default SimpleSelectable;
