import React, { useState } from "react";

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

interface IssueDisplayProps {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignees: string[];
}

function EditableIssueDisplay({
  title,
  description,
  status,
  priority,
  assignees,
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

  const { register, handleSubmit, control }: UseFormReturn = useForm();

  const submitHandler: SubmitHandler<FieldValues> = (data: FieldValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="issue-display">
      <Box maxW="1200px">
        <Box mb="2rem">
          <SimpleEditable
            register={register("title")}
            content={title}
            fontSize="lg"
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
              register={register("description")}
              height="sm"
              width={{ sm: "md", largeSmall: "lg", lg: "xl", xl: "2xl" }}
              content={description}
            />
          </Box>
          <Box className="issue-display_control">
            <Box w="3xs">
              <SimpleSelectable
                label="Status"
                name="status"
                defaultValue={status}
                collection={statusItems}
                control={control}
              />
            </Box>
            <Box w="3xs">
              <SimpleSelectable
                label="Priority"
                name="priority"
                defaultValue={priority}
                collection={priorityItems}
                control={control}
              />
            </Box>
            <Button type="submit">Submit</Button>
          </Box>
        </Flex>
      </Box>
    </form>
  );
}

export default EditableIssueDisplay;
