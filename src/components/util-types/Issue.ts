export type Issue = {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignees: { id: number; username: string }[];
};
