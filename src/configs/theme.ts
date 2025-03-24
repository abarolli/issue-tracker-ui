import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    breakpoints: {
      largeSmall: "600px",
    },
  },
});

export default createSystem(defaultConfig, config);
