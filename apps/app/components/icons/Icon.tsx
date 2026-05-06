import Money from "../../assets/icons/money.svg";
import Groceries from "../../assets/icons/groceries.svg";
import Rent from "../../assets/icons/rent.svg";
import Car from "../../assets/icons/car.svg";
import Food from "../../assets/icons/food.svg";
import Search from "../../assets/icons/search.svg";
import Calendar from "../../assets/icons/calendar.svg";
import ArrowLeft from "../../assets/icons/arrow_left.svg";
import ArrowRight from "../../assets/icons/arrow_rigth.svg";
import Bell from "../../assets/icons/bell.svg";
import Medicine from "../../assets/icons/medicine.svg";
import Savings from "../../assets/icons/savings.svg";
import Plus from "../../assets/icons/plus.svg";
import Gift from "../../assets/icons/gift.svg";
import Ticket from "../../assets/icons/ticket.svg";
import User from "../../assets/icons/user.svg";
import Shield from "../../assets/icons/shield.svg";
import Settings from "../../assets/icons/settings.svg";
import Help from "../../assets/icons/help.svg";
import Logout from "../../assets/icons/logout.svg";
import Income from "../../assets/icons/income.svg";
import Expense from "../../assets/icons/expense.svg";
import Close from "../../assets/icons/close.svg";
import Plane from "../../assets/icons/plane.svg";
import Book from "../../assets/icons/book.svg";
import Check from "../../assets/icons/check.svg";
import Bin from "../../assets/icons/bin.svg";
import Edit from "../../assets/icons/edit.svg";
import Key from "../../assets/icons/key.svg";
import ChevronRight from "../../assets/icons/chevron-right.svg";
import FingerPrint from "../../assets/icons/fingerprint.svg";

import { IconName } from "@repo/shared-types";
import { SvgProps } from "react-native-svg";
import { ComponentType } from "react";

const icons = {
  arrowUp: Money,
  arrowDown: Money,
  money: Money,
  groceries: Groceries,
  rent: Rent,
  car: Car,
  food: Food,
  search: Search,
  calendar: Calendar,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  bell: Bell,
  medicine: Medicine,
  savings: Savings,
  plus: Plus,
  gift: Gift,
  ticket: Ticket,
  user: User,
  shield: Shield,
  settings: Settings,
  help: Help,
  logout: Logout,
  income: Income,
  expense: Expense,
  close: Close,
  plane: Plane,
  book: Book,
  check: Check,
  bin: Bin,
  edit: Edit,
  key: Key,
  chevronRight: ChevronRight,
  fingerPrint: FingerPrint,
} satisfies Record<IconName, ComponentType<SvgProps>>;

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function Icon({
  name,
  size = 24,
  color = "#093030",
  strokeWidth = 1.5,
}: IconProps) {
  const SvgIcon = icons[name];

  if (!SvgIcon) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <SvgIcon
      width={size}
      height={size}
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
    />
  );
}
