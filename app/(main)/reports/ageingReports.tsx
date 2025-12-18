import FormDatePicker from "@/components/dashboard/FormDatePicker";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Appbar, Button } from "react-native-paper";
import api from "../../../lib/api";

interface AgeingReport {
  id: number;
  SEName: string;
  CustomerCode: string;
  CardName: string;
  InvoiceNo: string;
  InvoiceDate: string;
  InvoiceDueDate: string;
  CreditDays: number;
  InvoiceStatus: string;
  InvoiceAmount: number;
  BalanceDue: number;
  zeroToSixty: number;
  sixtyOneToOneTwenty: number;
  oneTwentyOneToOneEighty: number;
  oneEightyPlus: number;
}

export default function AgeingReports() {
  const [ageingReports, setAgeingReports] = useState<AgeingReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const pageSize = 8;

  const { control, watch } = useForm({
    defaultValues: {
      fromDate: null,
      toDate: null,
    },
  });

  const fromDate = watch("fromDate");
  const toDate = watch("toDate");

  useEffect(() => {
    fetchAgeingReports();
  }, []);

  const fetchAgeingReports = async () => {
    try {
      const response = await api.get("/ageing-reports");
      setAgeingReports(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  // 📅 DATE FILTER ONLY
  const filteredAgeingReports = useMemo(() => {
    return ageingReports.filter((inv) => {
      const invoiceDate = new Date(inv.InvoiceDate);

      const matchesFrom = !fromDate || invoiceDate >= new Date(fromDate);

      const matchesTo = !toDate || invoiceDate <= new Date(toDate);

      return matchesFrom && matchesTo;
    });
  }, [fromDate, toDate, ageingReports]);

  // 📄 PAGINATION
  const totalPages = Math.ceil(filteredAgeingReports.length / pageSize);
  const paginatedData = filteredAgeingReports.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // 📋 TABLE COLUMNS DEFINITION (with widths)
  const columns = [
    { label: "SE Name", key: "SEName", width: 140 },
    { label: "Customer Code", key: "CustomerCode", width: 140 },
    { label: "Card Name", key: "CardName", width: 160 },
    { label: "Invoice No", key: "InvoiceNo", width: 100 },
    { label: "Invoice Date", key: "InvoiceDate", width: 120 },
    { label: "Due Date", key: "InvoiceDueDate", width: 110 },
    { label: "Credit Days", key: "CreditDays", width: 120 },
    { label: "Status", key: "InvoiceStatus", width: 90 },
    { label: "Invoice Amt", key: "InvoiceAmount", width: 120 },
    { label: "Balance Due", key: "BalanceDue", width: 120 },
    { label: "0–60", key: "zeroToSixty", width: 120 },
    { label: "61–120", key: "sixtyOneToOneTwenty", width: 120 },
    { label: "121–180", key: "oneTwentyOneToOneEighty", width: 120 },
    { label: "180+", key: "oneEightyPlus", width: 120 },
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
        <Appbar.Content title="Ageing Report" />
      </Appbar.Header>

      {/* DATE FILTERS */}
      <View className="px-4 py-3">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <FormDatePicker
              control={control}
              name="fromDate"
              label="From Date"
            />
          </View>

          <View className="flex-1">
            <FormDatePicker control={control} name="toDate" label="To Date" />
          </View>
        </View>
      </View>

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
              {paginatedData.map((inv) => (
                <View
                  key={inv.id}
                  className="flex-row border-t border-gray-300"
                >
                  {columns.map((col) => (
                    <Text
                      key={col.key}
                      style={{ width: col.width }}
                      className="p-3 border-r border-gray-300"
                    >
                      {inv[col.key as keyof AgeingReport]}
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
