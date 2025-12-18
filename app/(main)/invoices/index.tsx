import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { Appbar } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import api from "../../../lib/api";

interface Invoice {
  id: number;
  invoiceId: number;
  invoiceAmount: number;
  custCode: string;
  custName: string;
  invoiceDate: string;
  paidToDate: number;
}

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await api.get("/invoices");
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
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
            <Appbar.Content title="Invoice List" />
          </Appbar.Header>
        </View>
      </View>

      <FlatList
        data={invoices}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <Link href={`/(main)/invoices/${item.invoiceId}` as any} asChild>
            <Pressable className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200 active:bg-gray-100">
              <View className="flex-row items-start gap-4">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800">
                    Invoice ID: {item.invoiceId}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    Invoice Amount: {item.invoiceAmount.toFixed(6)}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    Cust Code: {item.custCode}
                  </Text>

                  <Text className="text-sm text-gray-600 mt-1">
                    Cust Name:{item.custName}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-6">
                    Invoice Date: {item.invoiceDate}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    PaidToDate: {item.paidToDate}
                  </Text>
                </View>
                <View className=" px-3 mt-4 py-1 rounded-full">
                  <View className="flex-row items-center ">
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
            <Text className="text-gray-500">No Invoice found</Text>
          </View>
        }
      />
    </View>
  );
}
