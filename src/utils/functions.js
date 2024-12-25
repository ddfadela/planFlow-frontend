export const PROJECT_STATUS = {
  NOT_STARTED: {
    value: "NOT_STARTED",
    label: "Not Started",
    color: "orange",
  },
  IN_PROGRESS: {
    value: "IN_PROGRESS",
    label: "In Progress",
    color: "blue",
  },
  COMPLETED: {
    value: "COMPLETED",
    label: "Completed",
    color: "green",
  },
};

export const PROJECT_PRIORITY = {
  HIGH: {
    value: "HIGH",
    label: "High",
    color: "red",
  },
  MEDIUM: {
    value: "MEDIUM",
    label: "Medium",
    color: "orange",
  },
  LOW: {
    value: "LOW",
    label: "Low",
    color: "green",
  },
};

export const getStatusColor = (status) => {
  return PROJECT_STATUS[status]?.color || "red";
};

export const getPriorityColor = (priority) => {
  return PROJECT_PRIORITY[priority]?.color || "blue";
};

export const capitalizeFirstLetter = (text) => {
  return text.toLowerCase().replace(/^\w/, (char) => char.toUpperCase());
};
