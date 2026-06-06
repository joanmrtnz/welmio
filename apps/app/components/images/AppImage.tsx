import { Image, type ImageProps } from "expo-image";

type AppImageProps = ImageProps;

export function AppImage({
  contentFit = "contain",
  contentPosition = "center",
  transition = 150,
  cachePolicy = "memory-disk",
  ...props
}: AppImageProps) {
  return (
    <Image
      {...props}
      contentFit={contentFit}
      contentPosition={contentPosition}
      transition={transition}
      cachePolicy={cachePolicy}
    />
  );
}