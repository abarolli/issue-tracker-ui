import { useEffect, useState } from "react";

import { Box } from "@chakra-ui/react";
import LoginForm from "./components/LoginForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CreateIssueForm } from "./components/IssueDisplay";
import ROUTES from "./configs/routes";
import IssueRetriever from "./components/IssueRetriever";

interface AppProps {
  className?: string;
}

function App({ className }: AppProps) {
  return (
    <Box className={className}>
      <Router>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<LoginForm />} />
          <Route path={ROUTES.CREATE_ISSUE} element={<CreateIssueForm />} />
          <Route path="/issues/:id" element={<IssueRetriever />} />
        </Routes>
      </Router>
    </Box>
  );
}

export default App;
