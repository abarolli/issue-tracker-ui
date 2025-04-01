import { useEffect, useState } from "react";

import { Box } from "@chakra-ui/react";
import LoginForm from "./components/LoginForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CreateIssueForm } from "./components/IssueDisplay";
import ROUTES from "./configs/routes";
import IssueRetriever from "./components/IssueRetriever";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./components/LoginPage";
import IssueListingPage from "./components/IssueListingPage";

interface AppProps {
  className?: string;
}

function App({ className }: AppProps) {
  return (
    <Box className={className}>
      <Router>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route element={<PrivateRoute />}>
            <Route path={ROUTES.ISSUES} element={<IssueListingPage />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path={ROUTES.CREATE_ISSUE} element={<CreateIssueForm />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/issues/:id" element={<IssueRetriever />} />
          </Route>
        </Routes>
      </Router>
    </Box>
  );
}

export default App;
