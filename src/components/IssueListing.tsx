import {
  Box,
  ButtonGroup,
  Center,
  Pagination,
  Spinner,
  Stack,
  Table,
  IconButton,
  Text,
  Heading,
  Button,
  createListCollection,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

import _ from "lodash";

import IssueService from "../services/issue-service";
import { Issue, PriorityType, StatusType } from "./util-types/Issue";
import {
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuChevronsDownUp,
  LuChevronUp,
  LuExternalLink,
  LuNavigation,
} from "react-icons/lu";
import IssueRetriever from "./IssueRetriever";
import { useNavigate } from "react-router-dom";
import routes from "../configs/routes";
import Status from "./Status";
import Priority from "./Priority";
import SimpleSelectable, { SelectableItem } from "./SimpleSelectable";
import { useForm } from "react-hook-form";

type IssueResponseDto = {
  id: number;
} & Issue;

type ColumnHeader = {
  name: string;
  content: JSX.Element | string;
  width: number;
};

interface ResizableTableHeaderProps {
  columns: ColumnHeader[];
}

function ResizableTableHeader({ columns }: ResizableTableHeaderProps) {
  const [columnWidths, setColumnWidths] = useState(
    columns.map((column) => column.width)
  );
  const initialColumnWidths = useRef(columnWidths);
  const [isResizing, setResizing] = useState(false);
  const cursorPositionOnMouseDown = useRef<number | null>(null);
  const columnSelection = useRef<number | null>(null);

  useEffect(() => {
    document.body.onmousemove = handleMouseMove;
    document.body.onmouseleave = handleMouseLeave;
    document.body.onmouseup = handleMouseUp;
  }, [isResizing]);

  const handleMouseDown = (
    event: React.MouseEvent | MouseEvent,
    index: number
  ) => {
    event.preventDefault();
    setResizing(true);
    initialColumnWidths.current = columnWidths;
    cursorPositionOnMouseDown.current = event.clientX;
    columnSelection.current = index;
    document.body.style.cursor = "ew-resize";
  };

  const handleMouseMove = (event: React.MouseEvent | MouseEvent) => {
    if (!isResizing) return;
    event.preventDefault();
    const widthChange = event.clientX - cursorPositionOnMouseDown.current!;
    setColumnWidths((widths) => {
      const copy = [...widths];
      copy[columnSelection.current!] =
        initialColumnWidths.current[columnSelection.current!] + widthChange;
      return copy;
    });
  };

  const handleMouseUp = (event: React.MouseEvent | MouseEvent) => {
    setResizing(false);
    columnSelection.current = null;
    document.body.style.cursor = "auto";
  };

  const handleMouseLeave = (event: React.MouseEvent | MouseEvent) => {
    setResizing(false);
    columnSelection.current = null;
    document.body.style.cursor = "auto";
  };

  return (
    <Table.Header>
      <Table.Row>
        {columnWidths.map((width, index) => (
          <Table.ColumnHeader
            w={`${width}px`}
            key={index}
            h="40px"
            padding={0}
            overflow="hidden"
          >
            <Box
              h="100%"
              display="flex"
              alignItems="center"
              paddingLeft="10px"
              position="relative"
            >
              {columns[index].content}
              <Box
                w="2px"
                h="100%"
                position="absolute"
                right="0"
                bgColor={
                  isResizing && columnSelection.current === index ? "aqua" : ""
                }
                className="table-header_draggable"
                onMouseDown={(event) => handleMouseDown(event, index)}
              />
            </Box>
          </Table.ColumnHeader>
        ))}
      </Table.Row>
    </Table.Header>
  );
}

type Sort = {
  sortBy: string;
  order: "asc" | "desc";
};

function IssueListing() {
  const issueService = new IssueService();
  const [issues, setIssues] = useState<IssueResponseDto[]>([]);
  const [isLoading, setLoading] = useState(false);
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<Sort>({ sortBy: "id", order: "asc" });
  const [totalCount, setTotalCount] = useState(0);
  const [selection, setSelection] = useState<number | null>(null);
  const navigate = useNavigate();
  const { control } = useForm();

  const handleColumnChevronClick = (name: string) => {
    setSort((currentSort) => {
      const copy = { ...currentSort };
      if (currentSort.sortBy === name)
        copy.order = currentSort.order === "asc" ? "desc" : "asc";
      else {
        copy.sortBy = name;
        copy.order = "asc";
      }
      return copy;
    });
  };

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

  interface ColumnHeaderContentProps {
    label: string;
    name: string;
    sortable: boolean;
    filterComponent: JSX.Element;
  }

  function ColumnHeaderContent({
    label,
    name,
    sortable,
    filterComponent,
  }: ColumnHeaderContentProps) {
    const getChevron = () => {
      if (!sortable) return;
      if (sort.sortBy === name) {
        return sort.order === "asc" ? (
          <LuChevronUp onClick={() => handleColumnChevronClick(name)} />
        ) : (
          <LuChevronDown onClick={() => handleColumnChevronClick(name)} />
        );
      }
      return (
        <LuChevronsDownUp onClick={() => handleColumnChevronClick(name)} />
      );
    };

    return (
      <Stack>
        <Stack direction="row" alignItems="center">
          {label}
          {getChevron()}
        </Stack>
        {filterComponent}
      </Stack>
    );
  }

  const columns: ColumnHeader[] = [
    {
      width: 50,
      name: "id",
      content: (
        <ColumnHeaderContent
          label="Id"
          name="id"
          sortable={true}
          filterComponent={<Box></Box>}
        />
      ),
    },
    {
      width: 150,
      name: "title",
      content: (
        <ColumnHeaderContent
          label="Title"
          name="title"
          sortable={true}
          filterComponent={<Box></Box>}
        />
      ),
    },
    {
      width: 250,
      name: "description",
      content: (
        <ColumnHeaderContent
          label="Description"
          name="description"
          sortable={true}
          filterComponent={<Box></Box>}
        />
      ),
    },
    {
      width: 120,
      name: "status",
      content: (
        <ColumnHeaderContent
          label="Status"
          name="status"
          sortable={false}
          filterComponent={
            <Box w="6rem">
              <SimpleSelectable
                name="id"
                collection={statusItems}
                control={control}
              />
            </Box>
          }
        />
      ),
    },
    {
      width: 120,
      name: "priority",
      content: (
        <ColumnHeaderContent
          label="Priority"
          name="priority"
          sortable={false}
          filterComponent={
            <Box w="6rem">
              <SimpleSelectable
                name="id"
                collection={priorityItems}
                control={control}
              />
            </Box>
          }
        />
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    issueService
      .getIssues(page, pageSize, sort.sortBy, sort.order)
      .then((data) => {
        setIssues(data.content);
        setTotalCount(data.totalElements);
        setLoading(false);
      });
  }, [page, sort]);

  const getIssue = (id: number) => {
    setSelection(id);
  };

  return (
    <Stack>
      <Heading>Issues</Heading>
      {/* fixing table layout so column width is determined by table width, not cell content */}
      <Stack direction={{ base: "column", md: "row" }}>
        <Stack maxW="920px" w={{ base: "100%", md: "sm", lg: "auto" }}>
          <Table.ScrollArea>
            <Table.Root
              tableLayout="fixed"
              w="fit-content"
              variant="outline"
              showColumnBorder
              interactive
            >
              <ResizableTableHeader columns={columns} />
              <Table.Body>
                {issues.map((issue) => (
                  <Table.Row key={issue.id} onClick={() => getIssue(issue.id)}>
                    <Table.Cell whiteSpace="nowrap" overflow="hidden">
                      {issue.id}
                    </Table.Cell>
                    <Table.Cell whiteSpace="nowrap" overflow="hidden">
                      <Text truncate>{issue.title}</Text>
                    </Table.Cell>
                    <Table.Cell whiteSpace="nowrap" overflow="hidden">
                      <Text truncate>{issue.description}</Text>
                    </Table.Cell>
                    <Table.Cell whiteSpace="nowrap" overflow="hidden">
                      <Status status={issue.status as StatusType} />
                    </Table.Cell>
                    <Table.Cell whiteSpace="nowrap" overflow="hidden">
                      <Priority priority={issue.priority as PriorityType} />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
          {isLoading && (
            <Box pos="absolute" h="500px" w="full">
              <Center h="full">
                <Spinner />
              </Center>
            </Box>
          )}
          <Pagination.Root count={totalCount} pageSize={pageSize} page={page}>
            <ButtonGroup variant="ghost" size="sm">
              <Pagination.PrevTrigger asChild>
                <IconButton onClick={() => setPage((page) => page - 1)}>
                  <LuChevronLeft />
                </IconButton>
              </Pagination.PrevTrigger>
              <Pagination.Items
                render={(page) => (
                  <IconButton
                    variant={{ base: "ghost", _selected: "outline" }}
                    onClick={() => setPage(page.value)}
                  >
                    {page.value}
                  </IconButton>
                )}
              />
              <Pagination.NextTrigger asChild>
                <IconButton onClick={() => setPage((page) => page + 1)}>
                  <LuChevronRight />
                </IconButton>
              </Pagination.NextTrigger>
            </ButtonGroup>
          </Pagination.Root>
        </Stack>
        {selection && (
          <Box
            css={{ containerType: "inline-size" }}
            w={{ base: "100%", md: "499px" }}
            h="lg"
            overflowY="auto"
            padding="20px"
          >
            <Stack
              w="fit-content"
              position="sticky"
              top="0"
              left="100%"
              zIndex="max"
              alignItems="end"
            >
              <Text fontSize="xs" color="lightgrey">
                Issue #{selection}
              </Text>
              <Button
                bgColor="rgba(0, 0, 0, 0.1)"
                size="xs"
                onClick={() => navigate(routes.ISSUE(selection))}
                w="fit-content"
              >
                Full View
              </Button>
            </Stack>
            <IssueRetriever key={selection} id={selection} />
          </Box>
        )}
      </Stack>
    </Stack>
  );
}

export default IssueListing;
