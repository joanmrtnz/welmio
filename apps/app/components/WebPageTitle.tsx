import { useEffect } from "react";
import { Platform } from "react-native";

type WebPageTitleProps = {
  title: string;
};

export function WebPageTitle({ title }: WebPageTitleProps) {
  useEffect(() => {
    if (Platform.OS === "web") {
      document.title = title + " | Welmio App";
    }
  }, [title]);

  return null;
}