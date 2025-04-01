import React, { useEffect, useState } from "react";
import EditableIssueDisplay from "./IssueDisplay";
import { useNavigate, useParams } from "react-router-dom";
import ROUTES from "../configs/routes";
import { FieldValues, SubmitHandler } from "react-hook-form";
import IssueService from "../services/issue-service";
import { Issue } from "./util-types/Issue";
import { HttpStatusCode } from "axios";

function IssueRetriever() {
  const id = Number.parseInt(useParams().id!);
  const [issue, setIssue] = useState<Issue | null>(null);
  const navigate = useNavigate();
  const issueService = new IssueService();

  useEffect(() => {
    issueService
      .getIssue(id)
      .then((data) => {
        setIssue(data);
      })
      .catch(({ status }) => {
        if (
          status === HttpStatusCode.Forbidden ||
          status === HttpStatusCode.Unauthorized
        )
          navigate(ROUTES.LOGIN);
      });
  }, []);

  const updateIssue: SubmitHandler<FieldValues> = (data: FieldValues) => {
    issueService
      .updateIssue(id, data)
      .then((data) => console.log(data))
      .catch(({ status }) => {
        if (
          status === HttpStatusCode.Forbidden ||
          status === HttpStatusCode.Unauthorized
        )
          navigate(ROUTES.LOGIN);
      });
  };

  return issue ? (
    <EditableIssueDisplay
      disable={true}
      title={issue["title"]}
      description={issue["description"]}
      status={issue["status"]}
      priority={issue["priority"]}
      assignees={issue["assignees"].map((assignee) => ({
        id: assignee.id,
        value: assignee.id.toString(),
        label: assignee.username,
      }))}
      onSubmit={updateIssue}
    />
  ) : null;
}

export default IssueRetriever;
