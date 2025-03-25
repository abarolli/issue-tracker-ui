import React from "react";

import { Editable, IconButton } from "@chakra-ui/react";
import { LuCheck, LuX } from "react-icons/lu";
import { UseFormRegisterReturn } from "react-hook-form";

interface SimpleEditableProps {
  content: string;
  disable?: boolean;
  fontSize?: string;
  register?: UseFormRegisterReturn<string>;
  previewClassName?: string;
}

function SimpleEditable({
  content,
  disable,
  fontSize,
  register,
  previewClassName,
}: SimpleEditableProps) {
  return (
    <Editable.Root disabled={disable ?? false} defaultValue={content}>
      <Editable.Preview
        w="100%"
        fontSize={fontSize || "lg"}
        className={previewClassName}
      />
      <Editable.Input {...register} w="100%" fontSize={fontSize || "lg"} />
      <Editable.Control>
        <Editable.CancelTrigger asChild>
          <IconButton variant="outline" size="sm">
            <LuX />
          </IconButton>
        </Editable.CancelTrigger>
        <Editable.SubmitTrigger asChild>
          <IconButton variant="outline" size="sm">
            <LuCheck />
          </IconButton>
        </Editable.SubmitTrigger>
      </Editable.Control>
    </Editable.Root>
  );
}

export default SimpleEditable;
