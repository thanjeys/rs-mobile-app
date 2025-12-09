import FormProgressBar from "@/components/dashboard/FormProgressBar";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 p-5">
      <Text className="text-2xl font-semibold mb-8">Dashboard</Text>
      <View className="gap-4">
        <Link href="/(main)/customers" asChild>
          <Pressable className="bg-[#A5D8DD] p-5 rounded-lg">
            <Text className="text-center text-lg font-medium text-[#7B68A6]">
              Customers - 4
            </Text>
          </Pressable>
        </Link>

        <Link href="/(main)/activities" asChild>
          <Pressable className="bg-[#A5D8DD] p-5 rounded-lg">
            <Text className="text-center text-lg font-medium text-[#7B68A6]">
              Activities - 2
            </Text>
          </Pressable>
        </Link>
      </View>

      <FormProgressBar
        label="Target vs Achieved (Quantity)"
        completed={35}
        total={60}
      />
    </View>
  );
}
