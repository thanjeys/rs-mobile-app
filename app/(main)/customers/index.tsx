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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import api from "../../../lib/api";

interface Customer {
  cusID: number;
  customerCode: string;
  customerName: string;
}

interface ApiResponse {
  users: Customer[];
  total: number;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter((customer) =>
        customer.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchQuery, customers]);

  const fetchCustomers = async () => {
    try {
      const response = await api.get("/customers");
      setCustomers(response.data);
      setFilteredCustomers(response.data);
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

  const getInitials = (name: string = "") => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <View className="flex-1 bg-white">
      <View className=" border-b border-gray-200">
        <View className="text-2xl font-bold text-gray-800">
          <Appbar.Header>
            <Appbar.BackAction onPress={() => router.back()} />
            <Appbar.Content title="My Customers" />
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
        <Link href="/(main)/customers/create" asChild>
          <Pressable className="flex-[1] bg-[#A5D8DD] py-3 rounded-lg items-center justify-center">
            <Text className="text-[#7B68A6] font-medium">+ Create</Text>
          </Pressable>
        </Link>
      </View>

      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.cusID.toString()}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <Link href={`/(main)/customers/${item.cusID}` as any} asChild>
            <Pressable className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200 active:bg-gray-100">
              <View className="flex-row items-start gap-4">
                <Avatar.Text
                  size={60}
                  className="text-lg"
                  label={getInitials(item.customerName)}
                  style={{ backgroundColor: "#7B68A6" }}
                />
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800">
                    {item.customerName}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    {item.customerCode}
                  </Text>
                </View>
                <View className=" px-3 mt-4 py-1 rounded-full">
                  <View className="flex-row items-center">
                    <MaterialIcons
                      name="arrow-forward"
                      size={20}
                      color="black"
                    />
                  </View>
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
