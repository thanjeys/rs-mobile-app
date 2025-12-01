import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import api from "../../../lib/api";

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
}

interface ApiResponse {
  users: Customer[];
  total: number;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get<ApiResponse>("/users");
      setCustomers(response.data.users);
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
        <Text className="text-2xl font-bold text-gray-800">Customers</Text>
        <Text className="text-sm text-gray-500 mt-1">
          Total: {customers.length}
        </Text>
      </View>

      <Link href="/(main)/customers/create" asChild>
        <Pressable className="m-5 bg-[#A5D8DD] px-4 py-2 rounded-lg items-center">
          <Text className="text-[#7B68A6] font-medium">+ Add Customer</Text>
        </Pressable>
      </Link>

      <FlatList
        data={customers}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <Link href={`/(main)/customers/${item.id}` as any} asChild>
            <Pressable className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200 active:bg-gray-100">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800">
                    {item.firstName} {item.lastName}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    {item.email}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-0.5">
                    {item.phone}
                  </Text>
                </View>
                <View className="bg-[#A5D8DD] px-3 py-1 rounded-full">
                  <Text className="text-xs font-medium text-[#7B68A6]">
                    Age: {item.age}
                  </Text>
                </View>
              </View>
            </Pressable>
          </Link>
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-500">No customers found</Text>
          </View>
        }
      />
    </View>
  );
}
