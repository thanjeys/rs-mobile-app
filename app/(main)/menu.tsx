import * as React from "react";
import { View } from "react-native";
import { Drawer } from "react-native-paper";

export default function Home() {
  const [active, setActive] = React.useState("");

  return (
    <View className="flex-1 p-5">
      <Drawer.Section title="">
        <Drawer.Item
          label="Agent Reporting"
          icon="home"
          active={active === "agent"}
          onPress={() => setActive("agent")}
        />
        <Drawer.Item
          label="Customer Outstanding Report"
          icon="account"
          active={active === "outstanding"}
          onPress={() => setActive("outstanding")}
        />
        <Drawer.Item
          label="Collection Summary Report"
          icon="cog"
          active={active === "collectionSummary"}
          onPress={() => setActive("collectionSummary")}
        />
        <Drawer.Item
          label="Invoice Summary Report"
          icon="cog"
          active={active === "invoiceSummary"}
          onPress={() => setActive("invoiceSummary")}
        />
        <Drawer.Item
          label="Stock Report"
          icon="cog"
          active={active === "stockReport"}
          onPress={() => setActive("stockReport")}
        />
        <Drawer.Item
          label="Target Vs Actual Report"
          icon="cog"
          active={active === "targetVsActual"}
          onPress={() => setActive("targetVsActual")}
        />
      </Drawer.Section>
    </View>
  );
}
