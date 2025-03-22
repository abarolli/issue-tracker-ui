import React from "react";

import he from "he";
import { marked } from "marked";
import DOMPurify from "dompurify";
import parseHtmlToReact from "html-react-parser";

interface IssueDisplayProps {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignees: string[];
}

function IssueDisplay({
  title,
  description,
  status,
  priority,
  assignees,
}: IssueDisplayProps) {
  const parseMdToJsx = (rawHtml: string) => {
    const escapeScriptElements = (rawHtml: string) => {
      return rawHtml.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (match) =>
        he.escape(match)
      );
    };

    let sanitized = DOMPurify.sanitize(escapeScriptElements(rawHtml));
    return parseHtmlToReact(marked.parse(sanitized, { async: false }));
  };

  return (
    <>
      <h1>{title}</h1>
      <p>Description</p>
      {parseMdToJsx(description)}
      <p>Status</p>
      <p>{status}</p>
      <p>Priority</p>
      <p>{priority}</p>
      <p>Assignees</p>
      <p>{assignees}</p>
    </>
  );
}

export default IssueDisplay;
