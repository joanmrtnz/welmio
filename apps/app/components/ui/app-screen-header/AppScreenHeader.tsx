import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { router, type Href } from "expo-router";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";

type AppScreenHeaderProps = {
  title: string;
  backHref?: Href;
};

const BLACK = "#082f33";
const LIGHT_GREEN = "#f8fffc";
const DESKTOP_CONTENT_WIDTH = 1040;
const DESKTOP_BREAKPOINT = 768;

export function AppScreenHeader({ title, backHref }: AppScreenHeaderProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_BREAKPOINT;

  function handleBackPress() {
    if (backHref) {
      router.replace(backHref);
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/");
  }

  return (
    <View style={[styles.headerArea, isDesktop && styles.headerAreaDesktop]}>
      <Pressable
        hitSlop={12}
        onPress={handleBackPress}
        style={[styles.backButton, isDesktop && styles.backButtonDesktop]}
      >
        <Icon name="arrowLeft" size={28} strokeWidth={1.5} color={BLACK} />
      </Pressable>

      <Text
        pointerEvents="none"
        style={[styles.title, isDesktop && styles.titleDesktop]}
        numberOfLines={1}
      >
        {title}
      </Text>

      {/* Future implementation: notifications button */}
      {/* {!isDesktop ? (
        <View style={styles.notifications}>
          <Icon name="bell" size={24} strokeWidth={1.8} color={BLACK} />
        </View>
      ) : (
        <View />
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  headerArea: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingTop: 25,
    marginTop: 26,
    marginBottom: 18,
    minHeight: 42,
  },

  headerAreaDesktop: {
    width: "100%",
    maxWidth: DESKTOP_CONTENT_WIDTH,
    alignSelf: "center",
    paddingHorizontal: 32,
    marginTop: 24,
    marginBottom: 28,
  },

  backButton: {
    position: "absolute",
    left: 24,
    top: 15,
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    elevation: 10,
  },

  backButtonDesktop: {
    left: 32,
  },

  title: {
    width: "100%",
    textAlign: "center",
    fontSize: 19,
    fontFamily: fonts.bold,
    color: BLACK,
    paddingHorizontal: 58,
  },

  titleDesktop: {
    fontSize: 22,
    paddingHorizontal: 66,
  },

  notifications: {
    width: 42,
    height: 42,
    backgroundColor: LIGHT_GREEN,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
});
