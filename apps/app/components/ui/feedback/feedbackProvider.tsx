import { ReactNode, useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { feedback } from "./feedback.service";
import type { FeedbackMessage } from "./feedback.types";
import { styles } from "./feedback.styles";

type FeedbackProviderProps = {
  children: ReactNode;
};

export function FeedbackProvider({ children }: FeedbackProviderProps) {
  const [message, setMessage] = useState<FeedbackMessage | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return feedback.subscribe((nextMessage) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setMessage(nextMessage);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();

      timeoutRef.current = setTimeout(() => {
        hideMessage();
      }, nextMessage.duration ?? 2500);
    });
  }, []);

  function hideMessage() {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -12,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setMessage(null);
    });
  }

  return (
    <View style={styles.root}>
      {children}

      {message ? (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.toastWrapper,
            {
              opacity,
              transform: [{ translateY }],
            },
          ]}
        >
          <Pressable
            onPress={hideMessage}
            style={[styles.toast, styles[message.type]]}
          >
            <Text style={[styles.toastText, styles[`toastText_${message.type}`]]}>{message.message}</Text>
          </Pressable>
        </Animated.View>
      ) : null}
    </View>
  );
}