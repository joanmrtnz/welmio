import Image from "next/image";

export const Logo = () => {
  return (
    <Image
      src="/welmio-logo.svg"
      alt="Welmio Logo"
      width={42}
      height={40}
      priority
    />
  );
};
