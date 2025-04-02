import { Box } from "@chakra-ui/react";
import React from "react";
import { PriorityType } from "./util-types/Issue";

interface PriorityProps {
  priority: PriorityType;
}

function Priority({ priority }: PriorityProps) {
  const bgColors: { [K in typeof priority]: string } = {
    LOW: "lightgrey",
    MEDIUM: "yellow",
    HIGH: "orange",
    CRITICAL: "red",
  };
  return (
    <Box
      w="fit-content"
      bgColor={bgColors[priority]}
      padding="5px"
      rounded="sm"
    >
      {priority}
    </Box>
  );
}

export default Priority;
