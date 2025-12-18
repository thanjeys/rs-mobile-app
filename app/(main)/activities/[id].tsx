import api from "@/lib/api";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Appbar } from "react-native-paper";

interface Activity {
  activityID: number;
  customerName: string;
  StartDate: string;
  EndDate: string;
  status: string;
}

export default function ActivityDetail() {
  const { activityID } = useLocalSearchParams();
  const router = useRouter();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, [activityID]);

  const fetchActivity = async () => {
    try {
      const response = await api.get(`/activity/${activityID}`);
      setActivity(response.data[0]);
      console.log("API RESPONSE:", response.data);
    } catch (error) {
      console.error("Error fetching Activity:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#7B68A6" />
      </View>
    );
  }

  if (!activity) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-lg text-red-500">Activity not found</Text>
        <Pressable
          className="mt-4 bg-[#A5D8DD] px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-[#7B68A6] font-medium">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className=" border-b border-gray-200">
        <View className="text-2xl font-bold text-gray-800">
          <Appbar.Header>
            <Appbar.BackAction onPress={() => router.back()} />
            <Appbar.Content title="Activity Details" />
          </Appbar.Header>
        </View>
      </View>

      <ScrollView className="flex-1 bg-white">
        <View className="p-5">
          <View className="bg-gray-50 rounded-lg p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Activity: {activity.activityID}
            </Text>
            <Text className="text-base text-gray-500 mb-1">
              Customer Name: {activity.customerName}
            </Text>

            <View className="mb-3">
              <Text className="text-base text-gray-500">
                Start Date: {activity.StartDate}
              </Text>
              <Text className="text-base text-gray-500 mb-1">
                End Date: {activity.EndDate}
              </Text>
              <Text className="text-base text-gray-500">
                Status: {activity.status}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View className="gap-3 mt-6">
            <Link
              href={`/(main)/activities/edit?id=${activity.activityID}`}
              asChild
            >
              <Pressable className="bg-[#7B68A6] p-4 rounded-lg">
                <Text className="text-white text-center font-medium text-base">
                  Edit Activity
                </Text>
              </Pressable>
            </Link>

            <Pressable
              className="bg-gray-200 p-4 rounded-lg"
              onPress={() => router.back()}
            >
              <Text className="text-gray-700 text-center font-medium text-base">
                Back to List
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
