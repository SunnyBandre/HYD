import { Image } from "expo-image";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useTheme } from "../theme/theme";

// The logo art is a wide gold banner (content ~3.53:1).
const LOGO_ASPECT = 3.53;

type LogoProps = {
  /** Badge height in px; width follows the logo's aspect ratio. */
  height?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * The gold HYD logo is rendered on a maroon badge with a gold border so it
 * stays readable on light and dark backgrounds. The badge is sized to the
 * logo's true 3.12:1 aspect ratio — no empty canvas around it.
 */
export default function Logo({ height = 40, style }: LogoProps) {
  const { colors } = useTheme();
  const width = Math.round(height * LOGO_ASPECT);

  return (
    <View
      style={[
        styles.badge,
        {
          width,
          height,
          backgroundColor: colors.primaryDeep,
          borderColor: colors.accent,
        },
        style,
      ]}
    >
      <Image
        source={require("../assets/images/logo.png")}
        style={StyleSheet.absoluteFill}
        contentFit="contain"
        cachePolicy="memory-disk"
        transition={200}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    overflow: "hidden",
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: "center",
  },
});