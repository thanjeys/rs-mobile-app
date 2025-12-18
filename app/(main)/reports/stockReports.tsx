import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Appbar, Button } from "react-native-paper";
import api from "../../../lib/api";

interface StockReport {
  id: number;
  ItemCode: string;
  ItemName: string;
  OnHand: number;
}

export default function StockReports() {
  const [stockReports, setStockReports] = useState<StockReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    fetchStockReports();
  }, []);

  const fetchStockReports = async () => {
    try {
      const response = await api.get("/stock-reports");
      setStockReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  // 📄 PAGINATION
  const totalPages = Math.ceil(stockReports.length / pageSize);
  const paginatedData = stockReports.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // 📋 TABLE COLUMNS DEFINITION (with widths)
  const columns = [
    { label: "Item Code", key: "ItemCode", width: 140 },
    { label: "Item Name", key: "ItemName", width: 300 },
    { label: "On Hand", key: "OnHand", width: 120 },
  ];

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Stock Report" />
      </Appbar.Header>

      {/* TABLE */}
      <ScrollView scrollEnabled={true} className="flex-1">
        <ScrollView horizontal scrollEnabled={true}>
          <View>
            <View className="border border-gray-300 rounded-lg overflow-hidden m-4">
              {/* HEADER */}
              <View className="flex-row bg-gray-200">
                {columns.map((col) => (
                  <Text
                    key={col.key}
                    style={{ width: col.width }}
                    className="p-3 font-bold border-r border-gray-300"
                  >
                    {col.label}
                  </Text>
                ))}
              </View>

              {/* ROWS */}
              {paginatedData.map((report) => (
                <View
                  key={report.id}
                  className="flex-row border-t border-gray-300"
                >
                  {columns.map((col) => (
                    <Text
                      key={col.key}
                      style={{ width: col.width }}
                      className="p-3 border-r border-gray-300"
                    >
                      {report[col.key as keyof StockReport]}
                    </Text>
                  ))}
                </View>
              ))}
            </View>

            {/* PAGINATION */}
            <View className="flex-row justify-between items-center p-3 border-t border-gray-300 m-4 bg-white">
              {page > 1 && (
                <Button onPress={() => setPage((p) => p - 1)}>Previous</Button>
              )}

              <Text className="flex-1 text-center">
                Page {page} of {totalPages}
              </Text>

              {page < totalPages && (
                <Button onPress={() => setPage((p) => p + 1)}>Next</Button>
              )}
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}
