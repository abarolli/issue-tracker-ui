import React, { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import EditableIssueDisplay from "./IssueDisplay";
import { useNavigate, useParams } from "react-router-dom";
import ROUTES from "../configs/routes";
import { FieldValues, SubmitHandler } from "react-hook-form";

function IssueRetriever() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get(`/issues/${id}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("jwt")}` },
      })
      .then(({ data }) => {
        setIssue(data);
      })
      .catch(({ status }) => {
        if (status === 403) navigate(ROUTES.LOGIN);
      });
  }, []);

  const updateIssue: SubmitHandler<FieldValues> = (data: FieldValues) => {
    apiClient
      .patch(
        `/issues/${id}`,
        { ...data, assignees: [] },
        {
          headers: { Authorization: "Bearer " + sessionStorage.getItem("jwt") },
        }
      )
      .then(({ data }) => console.log(data))
      .catch(({ status }) => {
        if (status === 403) navigate(ROUTES.LOGIN);
      });
  };

  return issue ? (
    <EditableIssueDisplay
      disable={true}
      title={issue["title"]}
      description={issue["description"]}
      status={issue["status"]}
      priority={issue["priority"]}
      onSubmit={updateIssue}
    />
  ) : null;
}

export default IssueRetriever;
