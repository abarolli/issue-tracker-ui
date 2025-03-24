import React from "react";
import AppUsernameInput from "./AppUsernameInput";
import AppPasswordInput from "./AppPasswordInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Button, Stack } from "@chakra-ui/react";

function LoginForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = (data: FieldValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack rowGap="20px">
        <AppUsernameInput register={register("username")} />
        <AppPasswordInput register={register("password")} />
        <Button type="submit">Login</Button>
      </Stack>
    </form>
  );
}

export default LoginForm;
