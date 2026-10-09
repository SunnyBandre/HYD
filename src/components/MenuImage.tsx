import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  Animated,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "../theme/theme";

type MenuImageProps = {
  source?: any;
  style?: StyleProp<ViewStyle>;
};

/**
 * Wraps expo-image (disk + memory caching, native decoding) with a
 * pulsing skeleton placeholder so the card never pops in empty.
 * Falls back to a plate emoji if the image fails to load.
 */
export default function MenuImage({ source, style }: MenuImageProps) {
  const { colors } = useTheme();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pulse] = useState(() => new Animated.Value(1));

  // Shimmer/pulse the skeleton while the real image isn't shown yet.
  useEffect(() => {
    if (loaded) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [loaded, pulse]);

  return (
    <View style={[styles.wrap, { backgroundColor: colors.surfaceSoft }, style]}>
      {!loaded && (
        <Animated.View
          style={[styles.skeleton, { backgroundColor: colors.skeleton, opacity: pulse }]}
        />
      )}

      {failed ? (
        <View style={[styles.placeholder, { backgroundColor: colors.surfaceSoft }]}>
          <Text style={{ fontSize: 28 }}>🍽️</Text>
        </View>
      ) : (
        <Image
          source={source}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={{ duration: 250, effect: "cross-dissolve" }}
          cachePolicy="memory-disk"
          onDisplay={() => setLoaded(true)}
          onError={() => {
            setFailed(true);
            setLoaded(true);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
  },
  skeleton: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});