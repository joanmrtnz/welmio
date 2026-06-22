import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "welmio.accessToken";
const REFRESH_TOKEN_KEY = "welmio.refreshToken";

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export async function setStorageItem(key: string, value: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

export async function getStorageItem(key: string) {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  }

  return SecureStore.getItemAsync(key);
}

export async function deleteStorageItem(key: string) {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
    return;
  }

  await SecureStore.deleteItemAsync(key);
}

export async function setAccessToken(accessToken: string) {
  await setStorageItem(ACCESS_TOKEN_KEY, accessToken);
}

export async function getAccessToken() {
  return getStorageItem(ACCESS_TOKEN_KEY);
}

export async function setRefreshToken(refreshToken: string) {
  await setStorageItem(REFRESH_TOKEN_KEY, refreshToken);
}

export async function getRefreshToken() {
  return getStorageItem(REFRESH_TOKEN_KEY);
}

export async function setAuthTokens(tokens: AuthTokens) {
  await Promise.all([
    setAccessToken(tokens.accessToken),
    setRefreshToken(tokens.refreshToken),
  ]);
}

export async function clearAuthTokens() {
  await Promise.all([
    deleteStorageItem(ACCESS_TOKEN_KEY),
    deleteStorageItem(REFRESH_TOKEN_KEY),
  ]);
}