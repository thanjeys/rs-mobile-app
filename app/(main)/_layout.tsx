import { Stack } from "expo-router";
import Header from "../../components/Header";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function MainLayout() {
  return (
    <ProtectedRoute>
      <Header />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="menu" options={{ headerShown: false }} />
        <Stack.Screen name="customers/index" options={{ headerShown: false }} />
        <Stack.Screen
          name="customers/create"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="customers/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="customers/edit" options={{ headerShown: false }} />
        <Stack.Screen
          name="activities/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="activities/create"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="activities/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="activities/edit" options={{ headerShown: false }} />
        <Stack.Screen name="products/index" options={{ headerShown: false }} />
        <Stack.Screen name="carts/index" options={{ headerShown: false }} />
        <Stack.Screen name="invoices/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="invoices/index" options={{ headerShown: false }} />
        <Stack.Screen name="orders/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="orders/index" options={{ headerShown: false }} />
      </Stack>
    </ProtectedRoute>
  );
}
