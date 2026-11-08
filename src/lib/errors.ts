import axios from "axios";

interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as ApiErrorBody | undefined;

    if (body?.errors) {
      const firstError = Object.values(body.errors)[0];

      if (firstError?.length) {
        return firstError[0];
      }
    }

    if (body?.message) {
      return body.message;
    }

    return error.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
};
