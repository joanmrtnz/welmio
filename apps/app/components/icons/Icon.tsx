import Money from "../../assets/icons/money.svg";
import Groceries from "../../assets/icons/groceries.svg";
import Rent from "../../assets/icons/rent.svg";
import Car from "../../assets/icons/car.svg";
import Food from "../../assets/icons/food.svg";
import Search from "../../assets/icons/search.svg";
import Calendar from "../../assets/icons/calendar.svg";
import Back from "../../assets/icons/back.svg";
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


const icons = {
  money: Money,
  groceries: Groceries,
  rent: Rent,
  car: Car,
  food: Food,
  search: Search,
  calendar: Calendar,
  back: Back,
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
};

type IconName = keyof typeof icons;

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
};

export function Icon({
  name,
  size = 24,
  color = "#093030",
}: IconProps) {
  const SvgIcon = icons[name];

  if (!SvgIcon) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <SvgIcon width={size} height={size} stroke={color} />;
}
