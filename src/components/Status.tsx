import { Box } from "@chakra-ui/react";
import React from "react";
import { StatusType } from "./util-types/Issue";

interface StatusProps {
  status: StatusType;
}

function Status({ status }: StatusProps) {
  const bgColors: { [K in typeof status]: string } = {
    OPEN: "lightgrey",
    IN_PROGRESS: "aqua",
    CLOSED: "lightgreen",
    RESOLVED: "lightgreen",
  };
  return (
    <Box w="fit-content" bgColor={bgColors[status]} padding="5px" rounded="sm">
      {status}
    </Box>
  );
}

export default Status;
