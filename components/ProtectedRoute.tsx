import { useRouter, useSegments } from "expo-router";
import { ReactNode, useEffect } from "react";
import { useAuthStore } from "../lib/authStore";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, isLoading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!token && !inAuthGroup) {
      router.replace("/(auth)/login");
    }
  }, [token, isLoading, segments]);

  return <>{children}</>;
}
