import Image from "next/image";

export const AppBadges = () => {
  return (
    <div>
      <Image
        src="/google-play.svg"
        alt="Get it on Google Play"
        width={140}
        height={40}
      />
    </div>
  );
};
