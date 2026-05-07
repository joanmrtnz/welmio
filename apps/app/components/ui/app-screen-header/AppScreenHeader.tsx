import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { fonts } from "@/theme/fonts";
import { Icon } from "@/components/icons/Icon";

type AppScreenHeaderProps = {
  title: string;
};

const BLACK = "#082f33";
const LIGHT_GREEN = "#f8fffc";

export function AppScreenHeader({ title }: AppScreenHeaderProps) {
  return (
    <View style={styles.headerArea}>
      <Pressable hitSlop={12} onPress={() => router.back()}>
        <Icon name="arrowLeft" size={24} strokeWidth={2.5} color={BLACK} />
      </Pressable>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.notifications}>
        <Icon name="bell" size={24} strokeWidth={1.8} color={BLACK} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerArea: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingTop: 24,
    marginTop: 26,
    marginBottom: 22,
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 19,
    fontFamily: fonts.bold,
    color: BLACK,
    marginHorizontal: 16,
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
