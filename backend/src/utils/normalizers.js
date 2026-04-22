export const STATUS = {
  PLANNING: "PLANNING",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  ON_HOLD: "ON_HOLD",
  CANCELLED: "CANCELLED",
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
  TEAM_LEAD: "TEAM_LEAD",
  CONTRIBUTOR: "CONTRIBUTOR",
};

export const normalizeProjectStatus = (value = "") => {
  const status = value.toUpperCase().replaceAll(" ", "_");
  return Object.values(STATUS).includes(status) ? status : STATUS.PLANNING;
};

export const normalizeTaskStatus = (value = "") => {
  const status = value.toUpperCase().replaceAll(" ", "_");
  return [STATUS.TODO, STATUS.IN_PROGRESS, STATUS.DONE].includes(status)
    ? status
    : STATUS.TODO;
};

export const normalizePriority = (value = "") => {
  const priority = value.toUpperCase();
  return ["LOW", "MEDIUM", "HIGH"].includes(priority) ? priority : "MEDIUM";
};

export const normalizeTaskType = (value = "") => {
  const type = value.toUpperCase();
  return ["TASK", "BUG", "FEATURE", "IMPROVEMENT", "OTHER"].includes(type)
    ? type
    : "TASK";
};

export const normalizeRole = (value = "", fallback = STATUS.MEMBER) => {
  const role = value.toUpperCase().replace("ORG:", "");
  return [STATUS.ADMIN, STATUS.MEMBER, STATUS.TEAM_LEAD, STATUS.CONTRIBUTOR].includes(role)
    ? role
    : fallback;
};
