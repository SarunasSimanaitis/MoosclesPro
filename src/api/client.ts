type ApiErrorPayload = {
  error?: string;
  message?: string;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(
    message: string,
    status: number,
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = Omit<
  RequestInit,
  "body"
> & {
  body?: unknown;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers = new Headers(
    options.headers,
  );

  if (
    options.body !== undefined &&
    !headers.has("Content-Type")
  ) {
    headers.set(
      "Content-Type",
      "application/json",
    );
  }

  const response = await fetch(
    path,
    {
      ...options,
      headers,
      credentials: "include",
      body:
        options.body !== undefined
          ? JSON.stringify(options.body)
          : undefined,
    },
  );

  if (!response.ok) {
    let message =
      `Request failed with status ${response.status}.`;

    try {
      const payload =
        (await response.json()) as ApiErrorPayload;

      if (
        typeof payload.error ===
        "string"
      ) {
        message = payload.error;
      } else if (
        typeof payload.message ===
        "string"
      ) {
        message = payload.message;
      }
    } catch {
      // Keep the fallback error message.
    }

    throw new ApiError(
      message,
      response.status,
    );
  }

  /*
   * Some endpoints may eventually return
   * an empty response body.
   */
  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}