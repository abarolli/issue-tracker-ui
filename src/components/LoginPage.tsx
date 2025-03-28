import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import LoginForm from "./LoginForm";

function LoginPage() {
  return (
    <Flex h="100vh" justifyContent="center" alignItems="center">
      <Box w="300px">
        <LoginForm />
      </Box>
    </Flex>
  );
}

export default LoginPage;
