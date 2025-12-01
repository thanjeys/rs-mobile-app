import api from "@/lib/api";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

interface Activity {
  id: number;
  activityType: string;
  customerCode: string;
  subject: string;
}

interface ApiResponse {
  comments: Activity[];
  total: number;
}

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await api.get<ApiResponse>("/comments");
      setActivities(response.data.comments);
    } catch (error) {
      console.error("Error fetching customers:", error);
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

  return (
    <View className="flex-1 bg-white">
      <View className="p-5 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">Activities</Text>
        <Text className="text-sm text-gray-500 mt-1">
          Total: {activities.length}
        </Text>
      </View>

      <Link href="/(main)/activities/create" asChild>
        <Pressable className="m-5 bg-[#A5D8DD] px-4 py-2 rounded-lg items-center">
          <Text className="text-[#7B68A6] font-medium">+ Create Activity</Text>
        </Pressable>
      </Link>

      <FlatList
        data={activities}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <Link href={`/(main)/activities/#` as any} asChild>
            <Pressable className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200 active:bg-gray-100">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800">
                    {item.body}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    {item.postId}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    Activity ID: {item.id}
                  </Text>

                  <Text className="text-sm text-gray-500 mt-0.5">
                    Customer: {item.user.fullName}
                  </Text>
                </View>
              </View>
            </Pressable>
          </Link>
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-500">No Activity found</Text>
          </View>
        }
      />
    </View>
  );
}
