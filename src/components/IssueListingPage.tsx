import React from "react";
import IssueListing from "./IssueListing";
import { Box, Flex } from "@chakra-ui/react";
import IssueRetriever from "./IssueRetriever";

function IssueListingPage() {
  return (
    <Box padding="3rem">
      <IssueListing />
    </Box>
  );
}

export default IssueListingPage;
