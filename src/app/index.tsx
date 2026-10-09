import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Logo from "../components/Logo";
import { useTheme } from "../theme/theme";

const SPLASH_STAY_MS = 2200;

export default function LoadingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [fade] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => router.replace("/menu"), SPLASH_STAY_MS);
    return () => clearTimeout(timer);
  }, [fade, router]);

  return (
    <View style={[styles.container, { backgroundColor: colors.primaryDeep }]}>
      <Animated.View style={{ opacity: fade, alignItems: "center" }}>
        <Logo height={86} style={styles.logo} />
        <Text style={styles.title}>Hyderabadi Chai & Grill</Text>
        <Text style={[styles.tagline, { color: colors.accentSoft }]}>
          A taste of Hyderabad in every bite and sip
        </Text>
      </Animated.View>
      <ActivityIndicator
        size="large"
        color={colors.accent}
        style={{ marginTop: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  logo: { borderRadius: 20, marginBottom: 28 },
  title: {
    fontFamily: "RozhaOne",
    fontSize: 34,
    fontWeight: "700",
    color: "#FFF6E5",
    textAlign: "center",
  },
  tagline: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});