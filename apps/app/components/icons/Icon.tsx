import Money from "../../assets/icons/money.svg";
import Groceries from "../../assets/icons/groceries.svg";
import Rent from "../../assets/icons/rent.svg";
import Car from "../../assets/icons/car.svg";
import Food from "../../assets/icons/food.svg";
import Search from "../../assets/icons/search.svg";
import Calendar from "../../assets/icons/calendar.svg";
import Back from "../../assets/icons/back.svg";
import Bell from "../../assets/icons/bell.svg";





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
