import { View, Text, TouchableOpacity } from "react-native";
import { useAuthStore } from "../lib/authStore";

export default function Header() {
  const { logout } = useAuthStore();

  return (
    <View style={{ padding: 10, backgroundColor: "#eee" }}>
      <Text style={{ fontSize: 18 }}>Admin Panel</Text>
      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
