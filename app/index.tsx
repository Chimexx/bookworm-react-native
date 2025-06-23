import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index () {
  return (
    <View
      style={styles.container}
    >
      <Text style={styles.title}>Welcome</Text>
      <Link href={{
        pathname: "/(auth)/signup",
      }}>
        Signup
      </Link>

      <Link href={{
        pathname: "/(auth)",
      }}>
        Login
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "blue"
  }
});