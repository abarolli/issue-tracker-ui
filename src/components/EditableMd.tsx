import {
  Box,
  Editable,
  EditableValueChangeDetails,
  IconButton,
} from "@chakra-ui/react";
import he from "he";
import { marked } from "marked";
import { useState } from "react";
import { LuCheck, LuX } from "react-icons/lu";
import DOMPurify from "dompurify";
import parseHtmlToReact from "html-react-parser";
import { UseFormRegisterReturn } from "react-hook-form";

interface EditableMdProps {
  content: string;
  register?: UseFormRegisterReturn<string>;
}

const EditableMd = ({ content, register }: EditableMdProps) => {
  const [isEditing, setEditing] = useState(false);
  const [description, setDescription] = useState(content);

  const parseMdToJsx = (rawHtml: string) => {
    const escapeScriptElements = (rawHtml: string) => {
      return rawHtml.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (match) =>
        he.escape(match)
      );
    };

    rawHtml = marked.parse(rawHtml, { async: false });
    let sanitized = DOMPurify.sanitize(escapeScriptElements(rawHtml));
    return parseHtmlToReact(sanitized);
  };

  const startEditing = () => setEditing(true);
  const stopEditing = () => setEditing(false);

  const saveAndStopEditing = ({ value }: EditableValueChangeDetails) => {
    setDescription(value);
    stopEditing();
  };

  const stopEditingOnEscape: React.KeyboardEventHandler<HTMLDivElement> = (
    event
  ) => {
    if (event.key == "Escape") stopEditing();
  };

  const CustomPreview = () => {
    return isEditing ? (
      <Editable.Preview h="sm" />
    ) : (
      <Box
        className="markdown"
        onClick={startEditing}
        h="sm"
        w="100%"
        border="2px solid black"
      >
        {parseMdToJsx(description)}
      </Box>
    );
  };

  return (
    <Editable.Root
      defaultValue={description}
      onValueCommit={saveAndStopEditing}
      onFocusOutside={stopEditing}
      onKeyDown={stopEditingOnEscape}
      defaultEdit={isEditing}
    >
      <CustomPreview />
      <Editable.Textarea {...register} h="sm" />
      <Editable.Control>
        <Editable.CancelTrigger asChild onClick={stopEditing}>
          <IconButton variant="outline" size="sm">
            <LuX />
          </IconButton>
        </Editable.CancelTrigger>
        <Editable.SubmitTrigger asChild>
          <IconButton variant="outline" size="sm">
            <LuCheck />
          </IconButton>
        </Editable.SubmitTrigger>
      </Editable.Control>
    </Editable.Root>
  );
};

export default EditableMd;
