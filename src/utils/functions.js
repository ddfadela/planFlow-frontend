export const capitalizeFirstLetter = (text) => {
  return text.toLowerCase().replace(/^\w/, (char) => char.toUpperCase());
};

export const getStatusColor = (status) => {
  switch (status) {
    case "NOT_STARTED":
      return "orange";
    case "IN_PROGRESS":
      return "blue";
    case "COMPLETED":
      return "green";
    default:
      return "red";
  }
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case "HIGH":
      return "red";
    case "MEDIUM":
      return "orange";
    case "LOW":
      return "green";
    default:
      return "blue";
  }
};
