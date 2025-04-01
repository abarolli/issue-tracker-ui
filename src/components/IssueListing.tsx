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
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

type IssueResponseDto = {
  id: number;
} & Issue;

type TableColumn = { label: string; width: number };

interface ResizableTableHeaderProps {
  columns: TableColumn[];
}

function ResizableTableHeader({ columns }: ResizableTableHeaderProps) {
  const [tableColumns, setTableColumns] = useState(columns);
  const [isResizing, setResizing] = useState(false);
  const initialColumns = useRef(columns);
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
    initialColumns.current = tableColumns;
    cursorPositionOnMouseDown.current = event.clientX;
    columnSelection.current = index;
    document.body.style.cursor = "ew-resize";
  };

  const handleMouseMove = (event: React.MouseEvent | MouseEvent) => {
    if (!isResizing) return;
    event.preventDefault();
    const widthChange = event.clientX - cursorPositionOnMouseDown.current!;
    setTableColumns((columns) => {
      const copy = _.cloneDeep(columns);
      copy[columnSelection.current!].width =
        initialColumns.current[columnSelection.current!].width + widthChange;
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
        {tableColumns.map((column, index) => (
          <Table.ColumnHeader
            w={`${column.width}px`}
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
              {column.label}
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

function IssueListing() {
  const issueService = new IssueService();
  const [issues, setIssues] = useState<IssueResponseDto[]>([]);
  const [isLoading, setLoading] = useState(false);
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const columns: TableColumn[] = [
    { width: 50, label: "Id" },
    { width: 200, label: "Title" },
    { width: 200, label: "Description" },
    { width: 100, label: "Status" },
    { width: 100, label: "Priority" },
  ];

  useEffect(() => {
    setLoading(true);
    issueService.getIssues(page, pageSize).then((data) => {
      setIssues(data.content);
      setTotalCount(data.totalElements);
      setLoading(false);
    });
  }, [page]);

  return (
    <Stack>
      {/* fixing table layout so column width is determined by table width, not cell content */}
      <Table.ScrollArea>
        <Table.Root tableLayout="fixed" w="fit-content" showColumnBorder>
          <ResizableTableHeader columns={columns} />
          <Table.Body>
            {issues.map((issue) => (
              <Table.Row key={issue.id}>
                <Table.Cell whiteSpace="nowrap" overflow="hidden">
                  {issue.id}
                </Table.Cell>
                <Table.Cell>
                  <Text truncate>{issue.title}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text truncate>{issue.description}</Text>
                </Table.Cell>
                <Table.Cell>{issue.status}</Table.Cell>
                <Table.Cell>{issue.priority}</Table.Cell>
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
  );
}

export default IssueListing;
