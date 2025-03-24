import React from "react";

import { Field, Input } from "@chakra-ui/react";
import { UseFormRegisterReturn } from "react-hook-form";

interface AppUsernameInputProps {
  register: UseFormRegisterReturn;
}

function AppUsernameInput({ register }: AppUsernameInputProps) {
  return (
    <Field.Root>
      <Field.Label>Username</Field.Label>
      <Input {...register} />
    </Field.Root>
  );
}

export default AppUsernameInput;
