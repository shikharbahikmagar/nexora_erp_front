export const formatDate = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

export const formatDateTime = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

export const toDateInputValue = (value?: string | null) => {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
};

export const toDateTimeInputValue = (value?: string | null) => {
  if (!value) {
    return "";
  }

  return value.slice(0, 16);
};
