import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import api from "../../../lib/api";

interface Order {
  id: number;
  itemCode: string;
  itemName: string;
  quantity: number;
  sqftMtPrice: number;
  thickness: number;
  actualLength: number;
  actualHeight: number;
  sqFoot: number;
  totalSqFoot: number;
  sqMtr: number;
  totalSqMtr: number;
  lineTotal: number;
}

interface OrderItem {
  OrderID: number;
  OrderTotal: number;
  Items: string;
  orderitems: Order[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderHeader, setOrderHeader] = useState<{
    orderID: number;
    orderTotal: number;
    itemsNo: string;
  } | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get<OrderItem[]>("/order/1");
      //setOrders(response.data[0]);

      const order = response.data[0]; // first object
      setOrderHeader({
        orderID: order.OrderID,
        orderTotal: order.OrderTotal,
        itemsNo: order.Items,
      });

      setOrders(order.orderitems);
      console.log("Order Details:", response.data[0]);
    } catch (error) {
      console.error("Error fetching orders:", error);
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
        <View className="text-2xl font-bold text-gray-800  mx-10">
          <Appbar.Header className="mx-0 px-0">
            <Appbar.BackAction onPress={() => router.back()} />
            <Appbar.Content title="" />
          </Appbar.Header>
          <View className="pb-5 mb-5">
            <Text className="text-lg font-semibold text-gray-800">
              Order ID:{orderHeader?.orderID}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              Order Total:{orderHeader?.orderTotal}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              Items:{orderHeader?.itemsNo}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200 active:bg-gray-100">
            <View className="flex-row items-start gap-4">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">
                  {item.itemCode}
                </Text>
                <Text className="text-lg font-semibold text-gray-800">
                  {item.itemName}
                </Text>

                <Text className="text-sm text-gray-600 mt-1">
                  Quantity: {item.quantity}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  SqFt/MT Price: {item.sqftMtPrice.toFixed(6)}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  Thickness: {item.thickness}
                </Text>

                <Text className="text-sm text-gray-600 mt-1">
                  Actual Len:{item.actualLength}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  Actual Height: {item.actualHeight}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  SqFoot: {item.sqFoot}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  Total SqFoot: {item.totalSqFoot}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  SqMtr: {item.sqMtr}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  Total SqMtr: {item.totalSqMtr}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  LineTotal: {item.lineTotal}
                </Text>
              </View>
            </View>
          </View>
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
