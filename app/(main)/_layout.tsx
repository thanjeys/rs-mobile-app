import { Stack } from "expo-router";
import Header from "../../components/Header";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function MainLayout() {
  return (
    <ProtectedRoute>
      <Header />
       <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="customers/index" />
        <Stack.Screen name="customers/create" />
        <Stack.Screen name="customers/[id]" />
        <Stack.Screen name="activities/index" />
        <Stack.Screen name="activities/create" />
        <Stack.Screen name="activities/[id]" />
      </Stack>
    </ProtectedRoute>
  );
}
