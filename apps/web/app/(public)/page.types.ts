export type IconName =
  | "sparkles"
  | "monitor"
  | "mobile"
  | "external"
  | "check"
  | "globe"
  | "code"
  | "shield"
  | "database"
  | "wallet"
  | "cash"
  | "trendDown"
  | "target"
  | "chart"
  | "swap"
  | "pie"
  | "devices"
  | "filePlus"
  | "tag"
  | "github"
  | "linkedin"
  | "twitter"
  | "mail";

export type NavLink = {
  label: string;
  href: string;
};

export type IconCard = {
  icon: IconName;
  title: string;
  text: string;
};

export type Screenshot = {
  title: string;
  text: string;
  image: string;
};

export type TechStackItem = {
  logoSrc: string;
  name: string;
  text: string;
};
