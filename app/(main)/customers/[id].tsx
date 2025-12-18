import ContactIcons from "@/components/dashboard/ContactIcons";
import FormProgressBar from "@/components/dashboard/FormProgressBar";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Avatar, Icon } from "react-native-paper";
import api from "../../../lib/api";

interface Customer {
  cusID: number;
  customerName: string;
  customerGroup: string;
  customerCode: string;
  phone: string;
  city: string;
  state: string;
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
      const response = await api.get(`/customer/${id}`);
      setCustomer(response.data[0]);
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
              label={getInitials(`${customer.customerName}`)}
              style={{ backgroundColor: "#7B68A6" }}
            />
            <View>
              <Text className="text-2xl font-bold text-gray-800">
                {customer.customerName}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Customer ID: {customer.customerCode}
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

          <Text className="text-base text-gray-800 mt-1">
            {customer.city}, {customer.state}
          </Text>
        </View>

        {/* Contact Information */}
        <View className="flex flex-row gap-4 mb-4">
          <View className="bg-gray-50 rounded-lg p-4 mb-4 flex-1">
            <View className="mb-3">
              <Text className="text-base text-[#7B68A6] mb-1">
                5565096.000000
              </Text>
              <Text className="text-base text-gray-800">
                Outstanding Balance
              </Text>
            </View>
          </View>

          <View className="bg-gray-50 rounded-lg p-4 mb-4 flex-1">
            <View className="mb-3">
              <Text className="text-base text-[#7B68A6] mb-1">
                5565096.000000 INR
              </Text>
              <Text className="text-base text-gray-800">Overdue Balance</Text>
            </View>
          </View>
        </View>

        <View className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-200">
          <Text className="text-lg font-semibold text-gray-800 mb-8 border-b pb-2 rounded border-gray-200">
            Available Credit Limit : INR
          </Text>

          <FormProgressBar
            label="Target vs Achieved (Quantity)"
            completed={35}
            total={60}
          />
        </View>

        <View className="mb-4 mt-4">
          <Link href="/products" asChild>
            <Pressable className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200 active:bg-gray-100">
              <View className="flex-row items-start gap-4">
                <Icon source="package-variant" size={40} />
                <Text>Products</Text>
              </View>
            </Pressable>
          </Link>

          <Link href="/carts" asChild>
            <Pressable className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200 active:bg-gray-100">
              <View className="flex-row items-start gap-4">
                <Icon source="cart-variant" size={40} />
                <Text style={{ marginLeft: 8, fontSize: 16 }}>Carts</Text>
              </View>
            </Pressable>
          </Link>
        </View>

        {/* Actions */}
      </View>
    </ScrollView>
  );
}
