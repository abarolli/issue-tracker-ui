export default {
  LOGIN: "/login",
  CREATE_ISSUE: "/issues/create",
  ISSUE: (id: number | ":id") => `/issues/${id}`,
};
