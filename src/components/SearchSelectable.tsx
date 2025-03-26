import { Input, ListCollection, Select } from "@chakra-ui/react";
import React, { useState } from "react";
import { SelectableItem } from "./SimpleSelectable";

interface SearchSelectableProps {
  placeholder: string;
  defaultValue: string[];
  collection: ListCollection<SelectableItem>;
}

function SearchSelectable({
  collection,
  defaultValue,
  placeholder,
}: SearchSelectableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Select.Root collection={collection} multiple defaultValue={defaultValue}>
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
  );
}

export default SearchSelectable;
