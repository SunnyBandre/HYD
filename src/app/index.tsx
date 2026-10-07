import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function LoadingScreen() {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => router.replace("/menu"), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fade, alignItems: "center" }}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Hyderabadi Chai & Grill</Text>
        <Text style={styles.tagline}>
          A taste of Hyderabad in every bite and sip
        </Text>
      </Animated.View>
      <ActivityIndicator
        size="large"
        color="#D98324"
        style={{ marginTop: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3B1F0F",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: { width: 160, height: 160, marginBottom: 16 },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFF6E5",
    textAlign: "center",
  },
  tagline: {
    fontSize: 14,
    color: "#E8C99B",
    marginTop: 8,
    textAlign: "center",
  },
});
