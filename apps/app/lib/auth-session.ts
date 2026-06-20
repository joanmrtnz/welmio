import { refreshAccessToken } from "@/lib/api/auth";
import {
  clearAuthTokens,
  getRefreshToken,
  setAuthTokens,
} from "@/lib/auth-storage";

export async function restoreAuthSession() {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return false;
  }

  try {
    const tokens = await refreshAccessToken(refreshToken);

    if (!tokens?.accessToken || !tokens?.refreshToken) {
      await clearAuthTokens();
      return false;
    }

    await setAuthTokens({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

    return true;
  } catch {
    await clearAuthTokens();
    return false;
  }
}