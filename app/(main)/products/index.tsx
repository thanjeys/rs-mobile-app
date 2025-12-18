import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { Appbar, Icon } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useToast } from "../../../components/Toast";
import api from "../../../lib/api";

interface ApiResponse {
  products: Product[];
  total: number;
}

interface Product {
  id: number;
  itemCode: string;
  itemName: string;
  itemGroup: string;
  quantity: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get<Product[]>("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching Products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      const response = await api.post("/store-cart-items", {
        id: product.id,
        itemCode: product.itemCode,
        itemName: product.itemName,
        itemGroup: product.itemGroup,
        quantity: 1,
      });

      console.log("Item added to cart:", response.data);
      showToast("Item added to cart successfully!", "success");
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast("Failed to add item to cart", "error");
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
            <Appbar.Content title="My Products" />
          </Appbar.Header>
        </View>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200 active:bg-gray-100">
            <View className="flex-row items-start gap-4">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">
                  {item.itemCode}
                </Text>
                <Text className="text-sm text-purple-400 mt-1">
                  {item.itemName}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  {item.itemGroup}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  {item.quantity.toFixed(6)}
                </Text>
              </View>
              <View className=" px-3 mt-4 py-1 rounded-full">
                <View className="flex-row items-center">
                  <Pressable
                    onPress={() => handleAddToCart(item)}
                    className="mr-4"
                  >
                    <View className="flex-row items-start gap-4">
                      <Icon source="cart-variant" size={20} color="#A78BFA" />
                    </View>
                  </Pressable>
                  <MaterialIcons name="arrow-forward" size={20} color="black" />
                </View>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-500">No Products found</Text>
          </View>
        }
      />
    </View>
  );
}
