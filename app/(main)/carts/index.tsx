import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { Appbar, Icon } from "react-native-paper";
import { useToast } from "../../../components/Toast";
import api from "../../../lib/api";

interface CartItem {
  id: number;
  itemCode: string;
  itemName: string;
  unitPrice: number;
  totalPrice: number;
  quantity: number;
}

export default function CartItem() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await api.get("/cart-items");
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching Cart Items:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // DELETE CART ITEM FUNCTION
  // ---------------------------
  const handleDeleteCartItem = async (itemId: number) => {
    try {
      const response = await api.delete(`/delete-cart-item/${itemId}`);

      // Remove item from UI
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));

      showToast("Cart item deleted successfully!", "success");
      console.log("Delete response:", response.data);
    } catch (error) {
      console.error("Error deleting cart item:", error);
      showToast("Failed to delete cart item", "error");
    }
  };

  // ---------------------------
  // UPDATE QUANTITY FUNCTION
  // ---------------------------
  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    try {
      setCartItems(
        cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );

      const response = await api.put("/update-cart-item", {
        id: itemId,
        quantity: newQuantity,
      });

      showToast("Cart item updated successfully!", "success");
      console.log("Update response:", response.data);
    } catch (error) {
      console.error("Error updating cart item:", error);
      showToast("Failed to update cart item", "error");
      fetchCartItems(); // rollback UI
    }
  };

  // ---------------------------
  // CONTINUE TO ORDER FUNCTION
  // ---------------------------
  const handleContinueToOrder = async () => {
    try {
      // Prepare cart items data for the order
      const orderData = cartItems.map((item) => ({
        itemId: item.id,
        itemCode: item.itemCode,
        itemName: item.itemName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      }));

      const response = await api.post("/store-order-items", {
        items: orderData,
      });

      showToast("Order placed successfully!", "success");
      console.log("Order response:", response.data);

      // Navigate to customers page or wherever after successful order
    } catch (error) {
      console.error("Error placing order:", error);
      showToast("Failed to place order", "error");
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
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Cart Details" />
      </Appbar.Header>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200">
            <View className="flex-row items-start gap-4">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">
                  {item.itemCode}
                </Text>
                <Text className="text-sm text-purple-400">{item.itemName}</Text>

                <Text className="text-sm text-gray-600">
                  Unit Price: {item.unitPrice.toFixed(2)}
                </Text>

                <Text className="text-sm text-gray-600">
                  Total Price: {item.totalPrice.toFixed(2)}
                </Text>

                {/* Quantity Buttons */}
                <View className="flex-row items-center gap-3 mt-3">
                  <Pressable
                    onPress={() =>
                      item.quantity > 1 &&
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    disabled={item.quantity === 1}
                    className={`w-8 h-8 rounded justify-center items-center ${
                      item.quantity === 1 ? "bg-gray-300" : "bg-purple-500"
                    }`}
                  >
                    <Text className="text-white font-bold text-lg">−</Text>
                  </Pressable>

                  <Text className="text-base font-semibold text-gray-800 w-8 text-center">
                    {item.quantity}
                  </Text>

                  <Pressable
                    onPress={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    className="w-8 h-8 rounded bg-purple-500 justify-center items-center"
                  >
                    <Text className="text-white font-bold text-lg">+</Text>
                  </Pressable>
                </View>
              </View>

              {/* DELETE ICON */}
              <Pressable onPress={() => handleDeleteCartItem(item.id)}>
                <Icon source="delete" size={24} color="#A78BFA" />
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-500">No Products found</Text>
          </View>
        }
      />
      <View className="flex flex-row p-4 gap-2 bg-white border-t border-gray-200">
        <View className="flex-[3]">
          <Link href="/(main)/activities/" asChild>
            <Pressable className="flex-[1] bg-[#A5D8DD] py-3 rounded-lg items-center justify-center">
              <Text className="text-[#7B68A6] font-medium">
                Request a Quote
              </Text>
            </Pressable>
          </Link>
        </View>
        <View className="flex-[3]">
          <Pressable
            onPress={handleContinueToOrder}
            className="flex-[1] bg-[#A5D8DD] py-3 rounded-lg items-center justify-center"
          >
            <Text className="text-[#7B68A6] font-medium">
              Continue to Order
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
