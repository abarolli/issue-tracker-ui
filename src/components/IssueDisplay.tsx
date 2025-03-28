import React, { useMemo, useState } from "react";
import { useAsync } from "react-use";
import {
  Box,
  Button,
  createListCollection,
  Flex,
  Text,
} from "@chakra-ui/react";

import {
  FieldValues,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import EditableMd from "./EditableMd";
import SimpleSelectable, { SelectableItem } from "./SimpleSelectable";
import SimpleEditable from "./SimpleEditable";
import { useNavigate } from "react-router-dom";
import ROUTES from "../configs/routes";
import IssueService from "../services/issue-service";
import { HttpStatusCode } from "axios";
import UserService from "../services/user-service";
import SearchSelectable from "./SearchSelectable";

interface IssueDisplayProps {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assignees?: ({ id: number } & SelectableItem)[];
  disable?: boolean;
  onSubmit: SubmitHandler<FieldValues>;
}

function EditableIssueDisplay({
  title,
  description,
  status,
  priority,
  assignees,
  disable,
  onSubmit,
}: IssueDisplayProps) {
  var priorityItems = createListCollection<SelectableItem>({
    items: [
      { label: "LOW", value: "LOW" },
      { label: "MEDIUM", value: "MEDIUM" },
      { label: "HIGH", value: "HIGH" },
      { label: "CRITICAL", value: "CRITICAL" },
    ],
  });

  var statusItems = createListCollection<SelectableItem>({
    items: [
      { label: "OPEN", value: "OPEN" },
      { label: "IN PROGRESS", value: "IN_PROGRESS" },
      { label: "RESOLVED", value: "RESOLVED" },
      { label: "CLOSED", value: "CLOSED" },
    ],
  });

  const userService = new UserService();

  const state = useAsync(async () => {
    return userService.getUsers().then((data) =>
      data.content.map((user: any) => ({
        id: user.id,
        label: user.username,
        value: user.id.toString(),
      }))
    );
  });

  const userCollection = useMemo(
    () =>
      createListCollection({
        items: state.value ?? [],
      }),
    [state.value]
  );

  const { register, handleSubmit, control }: UseFormReturn = useForm();

  const DEFAULT_STATUS = "OPEN",
    DEFAULT_PRIORITY = "LOW";
  title ??= "";
  description ??= "";
  status ??= DEFAULT_STATUS;
  priority ??= DEFAULT_PRIORITY;
  disable ??= false;
  assignees ??= [];

  const [isDisabled, setDisabled] = useState(disable);

  const submitHandler: SubmitHandler<FieldValues> = (data: FieldValues) => {
    setDisabled(true);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="issue-display">
      <Box maxW="1200px">
        <Box mb="2rem">
          <Text>Title</Text>
          <SimpleEditable
            disable={isDisabled}
            register={register("title")}
            content={title}
            fontSize="lg"
            previewClassName="issue-display_title"
          />
        </Box>
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          md={{ flexDirection: "row", alignItems: "start" }}
        >
          <Box mb="1.3rem" md={{ mr: "1.3rem" }}>
            <Text fontWeight="500" lineHeight="1.25rem" mb=".375rem">
              Description
            </Text>
            <EditableMd
              disable={isDisabled}
              register={register("description")}
              height="sm"
              width={{
                base: "sm",
                sm: "md",
                largeSmall: "lg",
                lg: "xl",
                xl: "2xl",
              }}
              content={description}
            />
          </Box>
          <Box
            w={{ base: "100%", md: "200px" }}
            className="issue-display_control"
          >
            <SimpleSelectable
              disable={isDisabled}
              label="Status"
              name="status"
              defaultValue={status}
              collection={statusItems}
              control={control}
            />
            <SimpleSelectable
              disable={isDisabled}
              label="Priority"
              name="priority"
              defaultValue={priority}
              collection={priorityItems}
              control={control}
            />
            <SearchSelectable
              disable={isDisabled}
              label="Assignees"
              name="assignees"
              defaultValue={assignees}
              collection={userCollection}
              control={control}
              placeholder="Search"
            />
            <Button disabled={!isDisabled} onClick={() => setDisabled(false)}>
              Edit
            </Button>
            {!isDisabled && (
              <Button onClick={() => setDisabled(true)}>Cancel</Button>
            )}
            {!isDisabled && <Button type="submit">Save</Button>}
          </Box>
        </Flex>
      </Box>
    </form>
  );
}

export function CreateIssueForm() {
  const navigate = useNavigate();

  const issueService = new IssueService();

  const createIssue: SubmitHandler<FieldValues> = async (data: FieldValues) => {
    return issueService
      .saveIssue(data)
      .then((data) => {
        navigate(ROUTES.ISSUE(data.id));
      })
      .catch(({ status }) => {
        if (
          status === HttpStatusCode.Forbidden ||
          status === HttpStatusCode.Unauthorized
        )
          navigate(ROUTES.LOGIN);
      });
  };

  return <EditableIssueDisplay onSubmit={createIssue} />;
}

export default EditableIssueDisplay;
