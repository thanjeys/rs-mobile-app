import ContactIcons from "@/components/dashboard/ContactIcons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Avatar } from "react-native-paper";
import api from "../../../lib/api";

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    address: string;
    city: string;
    state: string;
  };
}

export default function CustomerDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const getInitials = (name: string = "") => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const response = await api.get(`/users/${id}`);
      setCustomer(response.data);
    } catch (error) {
      console.error("Error fetching customer:", error);
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

  if (!customer) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-lg text-red-500">Customer not found</Text>
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
    <ScrollView className="flex-1 bg-white">
      <View className="p-5">
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row items-start gap-4">
            <Avatar.Text
              size={60}
              className="text-lg"
              label={getInitials(`${customer.firstName} ${customer.lastName}`)}
              style={{ backgroundColor: "#7B68A6" }}
            />
            <View>
              <Text className="text-2xl font-bold text-gray-800">
                {customer.firstName} {customer.lastName}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Customer ID: {customer.id}
              </Text>
              <ContactIcons
                email="test@example.com"
                sms="+1234567890"
                phone="+1234567890"
              />
            </View>
          </View>
        </View>

        {/* Address */}
        <View className="bg-gray-50 rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Address
          </Text>

          <Text className="text-base text-gray-800">
            {customer.address.address}
          </Text>
          <Text className="text-base text-gray-800 mt-1">
            {customer.address.city}, {customer.address.state}
          </Text>
        </View>

        {/* Contact Information */}
        <View className="bg-gray-50 rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Contact Information
          </Text>

          <View className="mb-3">
            <Text className="text-xs text-gray-500 mb-1">Email</Text>
            <Text className="text-base text-gray-800">{customer.email}</Text>
          </View>

          <View>
            <Text className="text-xs text-gray-500 mb-1">Phone</Text>
            <Text className="text-base text-gray-800">{customer.phone}</Text>
          </View>
        </View>

        <View className="bg-gray-50 rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Contact Information
          </Text>

          <View className="mb-3">
            <Text className="text-xs text-gray-500 mb-1">Email</Text>
            <Text className="text-base text-gray-800">{customer.email}</Text>
          </View>

          <View>
            <Text className="text-xs text-gray-500 mb-1">Phone</Text>
            <Text className="text-base text-gray-800">{customer.phone}</Text>
          </View>
        </View>

        {/* Actions */}
        <View className="gap-3 mt-6">
          <Link href={`/(main)/customers/edit?id=${customer.id}`} asChild>
            <Pressable className="bg-[#7B68A6] p-4 rounded-lg">
              <Text className="text-white text-center font-medium text-base">
                Edit Customer
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
  );
}
