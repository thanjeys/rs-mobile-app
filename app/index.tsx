import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useAuthStore } from "../lib/authStore";

export default function Index() {
  const router = useRouter();
  const { token, isLoading, restoreSession } = useAuthStore();

  useEffect(() => {
    restoreSession();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (token) {
        router.replace("/(main)/home");
      } else {
        router.replace("/(auth)/login");
      }
    }
  }, [token, isLoading]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
       <ActivityIndicator size="large" />
    </View>
  );
}
