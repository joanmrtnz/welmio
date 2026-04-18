import { getAccessToken } from "@/app/lib/auth-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL is not defined");
}

type ApiFetchOptions = RequestInit & {
  token?: string | null;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { token, headers, ...rest } = options;

  const resolvedToken = token ?? (await getAccessToken());

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
      ...(headers ?? {}),
    },
  });

  const contentType = response.headers.get("content-type");

  let data: unknown = null;

  if (contentType?.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
        ? (data as { message: string }).message
        : "Request failed";

    throw new Error(message);
  }

  return data as T;
}