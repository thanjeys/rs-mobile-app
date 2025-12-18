import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import React from "react";
import { Image, View } from "react-native";
import { IconButton } from "react-native-paper";
import { useAuthStore } from "../lib/authStore";
import DropdownMenu, { DropdownMenuItem } from "./dashboard/DropdownMenu";

export default function Header() {
  const navigation = useNavigation<any>();
  const { logout } = useAuthStore();

  const menuItems: DropdownMenuItem[] = [
    {
      title: "Home",
      onPress: () => router.push("/(main)/home"),
    },
    {
      title: "Agent Reporting",
      onPress: () => router.push("/(main)/reports/ageingReports"),
    },
    {
      title: "Customer Outstanding Report",
      onPress: () => router.push("/(main)/reports/customerOutstandingReports"),
    },
    {
      title: "Collection Summary Report",
      onPress: () => router.push("/(main)/reports/collectionSummaryReports"),
    },
    {
      title: "Invoice Summary Report",
      onPress: () => router.push("/(main)/reports/invoiceSummaryReports"),
    },
    {
      title: "Stock Report",
      onPress: () => router.push("/(main)/reports/stockReports"),
    },
    {
      title: "Target Vs Actual Report",
      onPress: () => router.push("/(main)/reports/targetVsActualReports"),
    },

    {
      title: "Logout",
      onPress: async () => {
        await logout();
        router.replace("/(auth)/login");
      },
    },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#f3f4f6",
      }}
    >
      {/* Left side */}
      <View></View>

      {/* Right side */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Logo */}
        <Image
          source={require("../assets/images/rs_img_logo.png")}
          style={{ width: 104, height: 32, marginRight: 8 }}
          resizeMode="contain"
        />

        {/* Hamburger Menu */}
        <DropdownMenu
          anchor={<IconButton icon="menu" size={26} />}
          items={menuItems}
        />
      </View>
    </View>
  );
}
