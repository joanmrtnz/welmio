import { PropsWithChildren, useEffect, useRef } from "react";
import {
  Animated,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

const DEFAULT_BASE_COLOR = "rgba(6, 52, 54, 0.08)";
const DEFAULT_HIGHLIGHT_COLOR = "rgba(255, 255, 255, 0.55)";

type SkeletonProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  rounded?: number;
  baseColor?: string;
  highlightColor?: string;
}>;

export function Skeleton({
  children,
  style,
  rounded = 10,
  baseColor = DEFAULT_BASE_COLOR,
  highlightColor = DEFAULT_HIGHLIGHT_COLOR,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <View
      style={[
        styles.shell,
        { borderRadius: rounded, backgroundColor: baseColor },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            opacity,
            borderRadius: rounded,
            backgroundColor: highlightColor,
          },
        ]}
      />
      {children}
    </View>
  );
}

export function SkeletonText({
  width = "100%",
  height = 12,
  style,
}: {
  width?: ViewStyle["width"];
  height?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return <Skeleton style={[{ width, height }, style]} rounded={999} />;
}

const styles = StyleSheet.create({
  shell: {
    overflow: "hidden",
  },
});
