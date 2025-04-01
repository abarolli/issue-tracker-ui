import React, { useEffect, useState } from "react";
import EditableIssueDisplay from "./IssueDisplay";
import { useNavigate, useParams } from "react-router-dom";
import ROUTES from "../configs/routes";
import { FieldValues, SubmitHandler } from "react-hook-form";
import IssueService from "../services/issue-service";
import { Issue } from "./util-types/Issue";
import { HttpStatusCode } from "axios";

interface IssueRetrieverProps {
  id?: number;
}

function IssueRetriever({ id }: IssueRetrieverProps) {
  let paramId: any = useParams().id ?? id;
  if (paramId === null || paramId === undefined)
    throw new Error("Could not determine id for Issue retrieval");

  paramId = typeof paramId === "string" ? Number.parseInt(paramId) : paramId;
  const [issue, setIssue] = useState<Issue | null>(null);
  const navigate = useNavigate();
  const issueService = new IssueService();

  useEffect(() => {
    issueService
      .getIssue(paramId)
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
  }, [paramId]);

  const updateIssue: SubmitHandler<FieldValues> = (data: FieldValues) => {
    issueService
      .updateIssue(paramId, data)
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
