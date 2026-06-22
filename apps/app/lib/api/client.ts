import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from "@/lib/auth/auth-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type ApiFetchOptions = RequestInit & {
  skipAuthRefresh?: boolean;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let refreshPromise: Promise<string | null> | null = null;

async function parseResponse(response: Response) {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function refreshAccessTokenOnce() {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function refreshAccessToken() {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    await clearAuthTokens();
    return null;
  }

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    await clearAuthTokens();
    return null;
  }

  const tokens = (await parseResponse(response)) as {
    accessToken?: string;
    refreshToken?: string;
  } | null;

  if (!tokens?.accessToken || !tokens?.refreshToken) {
    await clearAuthTokens();
    return null;
  }

  await setAuthTokens({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });

  return tokens.accessToken;
}

async function request<T>(path: string, options: ApiFetchOptions = {}) {
  const accessToken = await getAccessToken();

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  return response;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}) {
  const response = await request<T>(path, options);

  if (response.status === 401 && !options.skipAuthRefresh) {
    const newAccessToken = await refreshAccessTokenOnce();

    if (newAccessToken) {
      const retryResponse = await request<T>(path, options);

      if (retryResponse.ok) {
        return parseResponse(retryResponse) as Promise<T>;
      }

      const retryErrorData = await parseResponse(retryResponse);
      throw new ApiError(
        retryResponse.status,
        getApiErrorMessage(retryErrorData, retryResponse.statusText),
        retryErrorData,
      );
    }
  }

  if (!response.ok) {
    const errorData = await parseResponse(response);
    throw new ApiError(
      response.status,
      getApiErrorMessage(errorData, response.statusText),
      errorData,
    );
  }

  return parseResponse(response) as Promise<T>;
}

function getApiErrorMessage(data: unknown, fallback: string) {
  if (
    data &&
    typeof data === "object" &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return fallback || "Request failed";
}
