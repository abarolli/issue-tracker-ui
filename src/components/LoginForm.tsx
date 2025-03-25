import React from "react";
import AppUsernameInput from "./AppUsernameInput";
import AppPasswordInput from "./AppPasswordInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Button, Stack } from "@chakra-ui/react";
import apiClient from "../services/api-client";
import { useNavigate } from "react-router-dom";
import ROUTES from "../configs/routes";

function LoginForm() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FieldValues> = (data: FieldValues) => {
    apiClient
      .post("/auth/login", {
        username: data.username,
        password: data.password,
      })
      .then(({ data }) => {
        sessionStorage.setItem("jwt", data.token);
        navigate(ROUTES.CREATE_ISSUE);
      });
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
