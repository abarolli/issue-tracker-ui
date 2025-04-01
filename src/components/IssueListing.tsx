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
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

import _ from "lodash";

import IssueService from "../services/issue-service";
import { Issue } from "./util-types/Issue";
import {
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuChevronsDownUp,
  LuChevronUp,
} from "react-icons/lu";
import IssueRetriever from "./IssueRetriever";

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
              w="100%"
              h="100%"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              paddingLeft="10px"
            >
              {columns[index].content}
              <Box
                w="2px"
                h="100%"
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

  interface ColumnHeaderContentProps {
    label: string;
    name: string;
    sortable: boolean;
  }

  function ColumnHeaderContent({
    label,
    name,
    sortable,
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
      <Stack direction="row" alignItems="center">
        {label}
        {getChevron()}
      </Stack>
    );
  }

  const columns: ColumnHeader[] = [
    {
      width: 50,
      name: "id",
      content: <ColumnHeaderContent label="Id" name="id" sortable={true} />,
    },
    {
      width: 200,
      name: "title",
      content: (
        <ColumnHeaderContent label="Title" name="title" sortable={true} />
      ),
    },
    {
      width: 200,
      name: "description",
      content: (
        <ColumnHeaderContent
          label="Description"
          name="description"
          sortable={true}
        />
      ),
    },
    {
      width: 100,
      name: "status",
      content: (
        <ColumnHeaderContent label="Status" name="status" sortable={false} />
      ),
    },
    {
      width: 100,
      name: "priority",
      content: (
        <ColumnHeaderContent
          label="Priority"
          name="priority"
          sortable={false}
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
      <Stack>
        {/* fixing table layout so column width is determined by table width, not cell content */}
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
                    {issue.status}
                  </Table.Cell>
                  <Table.Cell whiteSpace="nowrap" overflow="hidden">
                    {issue.priority}
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
        <Box w="100vw">
          <IssueRetriever key={selection} id={selection} />
        </Box>
      )}
    </Stack>
  );
}

export default IssueListing;
