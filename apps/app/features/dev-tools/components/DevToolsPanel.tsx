import { StyleSheet, View } from "react-native";

import {
  DEV_TOOL_ACTIONS,
  type DevToolAction,
} from "../constants/devToolActions";
import { DevToolActionButton } from "./DevToolActionButton";

type DevToolsPanelProps = {
  loadingActionId?: string | null;
  onActionPress: (action: DevToolAction) => void;
};

export function DevToolsPanel({
  loadingActionId,
  onActionPress,
}: DevToolsPanelProps) {
  return (
    <View style={styles.panel}>
      {DEV_TOOL_ACTIONS.map((action) => (
        <DevToolActionButton
          key={action.id}
          action={action}
          isLoading={loadingActionId === action.id}
          onPress={onActionPress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: 12,
  },
});
