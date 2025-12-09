import api from "@/lib/api";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Appbar, Avatar, Icon } from "react-native-paper";

interface Activity {
  id: number;
  activityType: string;
  customerCode: string;
  subject: string;

  //remove this after getting api with proper fields
  user: {
    fullName: string;
  };
  body: string;
  postId: number;
  likes: number;
}

interface ApiResponse {
  comments: Activity[];
  total: number;
}

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const getInitials = (name: string = "") => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredActivities(activities);
    } else {
      const filtered = activities.filter((activity) =>
        activity.user?.fullName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredActivities(filtered);
    }
  }, [searchQuery, activities]);

  const fetchActivities = async () => {
    try {
      const response = await api.get<ApiResponse>("/comments");
      setActivities(response.data.comments);
      setFilteredActivities(response.data.comments);
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
      <View className=" border-b border-gray-200">
        <View className="text-2xl font-bold text-gray-800">
          <Appbar.Header>
            <Appbar.BackAction onPress={() => router.back()} />
            <Appbar.Content title="My Activities" />
          </Appbar.Header>
        </View>
      </View>
      <View className="flex-row items-center px-5 py-4 gap-3">
        {/* LEFT — Search Box (3/4 width) */}
        <View className="flex-[3] bg-gray-100 border border-gray-300 rounded-lg flex-row items-center px-3">
          <TextInput
            className="flex-1 text-gray-800 py-3"
            placeholder="Search for customer ..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Icon source="magnify" size={22} color="#6B7280" />
        </View>

        {/* RIGHT — Create Button (1/4 width) */}
        <Link href="/(main)/activities/create" asChild>
          <Pressable className="flex-[1] bg-[#A5D8DD] py-3 rounded-lg items-center justify-center">
            <Text className="text-[#7B68A6] font-medium">+ Create</Text>
          </Pressable>
        </Link>
      </View>
      <FlatList
        data={filteredActivities}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <Link href={`/(main)/activities/${item.id}` as any} asChild>
            <Pressable className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200 active:bg-gray-100">
              <View className="flex-row items-start gap-4">
                <Avatar.Text
                  size={60}
                  className="text-lg"
                  label={getInitials(item.user.fullName)}
                  style={{ backgroundColor: "#7B68A6" }}
                />

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
