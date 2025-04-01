export default {
  LOGIN: "/login",
  ISSUES: "/issues",
  CREATE_ISSUE: "/issues/create",
  ISSUE: (id: number | ":id") => `/issues/${id}`,
};
