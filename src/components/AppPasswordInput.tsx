import React from "react";

import { Field } from "@chakra-ui/react";
import { PasswordInput } from "./ui/password-input";
import { UseFormRegisterReturn } from "react-hook-form";

interface AppPasswordInputProps {
  register: UseFormRegisterReturn;
}

function AppPasswordInput({ register }: AppPasswordInputProps) {
  return (
    <Field.Root>
      <Field.Label>Password</Field.Label>
      <PasswordInput {...register} />
    </Field.Root>
  );
}

export default AppPasswordInput;
