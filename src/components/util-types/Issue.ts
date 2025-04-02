export type Issue = {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignees: { id: number; username: string }[];
};

export type StatusType = "OPEN" | "IN_PROGRESS" | "CLOSED" | "RESOLVED";
