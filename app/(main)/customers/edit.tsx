import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import { z } from "zod";

import FormButton from "@/components/dashboard/FormButton";
import FormDropdown from "@/components/dashboard/FormDropdown";
import FormInput from "@/components/dashboard/FormInput";
import { useToast } from "@/components/Toast";
import api from "@/lib/api";

// Zod Schema (same as create)
const CustomerSchema = z.object({
  series: z.string().optional(),
  customerName: z.string().min(1, "Customer Name is required"),
  customerGroup: z.string().optional(),
  currency: z.string().optional(),
  customerPhone: z.string().optional(),
  customerMobile: z.string().optional(),
  panNumber: z.string().optional(),
  creditLimit: z.string().optional(),
  address: z.string().optional(),
  area: z.string().optional(),
  city: z.string().min(1, "City is required"),
  pinCode: z.string().optional(),
  state: z.string().min(1, "State is required"),
  gstn: z.string().optional(),
  contactPersonName: z.string().optional(),
  designation: z.string().optional(),
  contactPersonEmail: z.string().optional(),
  contactPersonMobile: z.string().optional(),
  contactPersonPhone: z.string().optional(),
});

type CustomerFormData = z.infer<typeof CustomerSchema>;

export default function CustomerEdit() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(CustomerSchema),
    mode: "onTouched",
    defaultValues: {
      series: "",
      customerName: "",
      customerGroup: "",
      currency: "",
      customerPhone: "",
      customerMobile: "",
      panNumber: "",
      creditLimit: "",
      address: "",
      area: "",
      city: "",
      pinCode: "",
      state: "",
      gstn: "",
      contactPersonName: "",
      designation: "",
      contactPersonEmail: "",
      contactPersonMobile: "",
      contactPersonPhone: "",
    },
  });

  // Fetch customer details
  const fetchCustomer = async () => {
    try {
      const res = await api.get(`/users/${id}`);
      const data = res.data;

      reset({
        series: typeof data.series === "string" ? data.series : "",
        customerName:
          typeof data.customerName === "string" ? data.customerName : "",
        customerGroup:
          typeof data.customerGroup === "string" ? data.customerGroup : "",
        currency: typeof data.currency === "string" ? data.currency : "",
        customerPhone:
          typeof data.customerPhone === "string" ? data.customerPhone : "",
        customerMobile:
          typeof data.customerMobile === "string" ? data.customerMobile : "",
        panNumber: typeof data.panNumber === "string" ? data.panNumber : "",
        creditLimit:
          typeof data.creditLimit === "string" ? data.creditLimit : "",
        address: typeof data.address === "string" ? data.address : "",
        area: typeof data.area === "string" ? data.area : "",
        city: typeof data.city === "string" ? data.city : "",
        pinCode: typeof data.pinCode === "string" ? data.pinCode : "",
        state: typeof data.state === "string" ? data.state : "",
        gstn: typeof data.gstn === "string" ? data.gstn : "",
        contactPersonName:
          typeof data.contactPersonName === "string"
            ? data.contactPersonName
            : "",
        designation:
          typeof data.designation === "string" ? data.designation : "",
        contactPersonEmail:
          typeof data.contactPersonEmail === "string"
            ? data.contactPersonEmail
            : "",
        contactPersonMobile:
          typeof data.contactPersonMobile === "string"
            ? data.contactPersonMobile
            : "",
        contactPersonPhone:
          typeof data.contactPersonPhone === "string"
            ? data.contactPersonPhone
            : "",
      });

      setLoading(false);
    } catch (error) {
      showToast("Failed to load customer details", "error");
      router.back();
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  const onSubmit = async (values: CustomerFormData) => {
    try {
      await api.put(`/users/update/${id}`, {
        series: values.series,
        customerName: values.customerName,
        customerGroup: values.customerGroup,
        currency: values.currency,
        customerPhone: values.customerPhone,
        customerMobile: values.customerMobile,
        panNumber: values.panNumber,
        creditLimit: values.creditLimit,
        address: values.address,
        area: values.area,
        city: values.city,
        pinCode: values.pinCode,
        state: values.state,
        gstn: values.gstn,
        contactPersonName: values.contactPersonName,
        designation: values.designation,
        contactPersonEmail: values.contactPersonEmail,
        contactPersonMobile: values.contactPersonMobile,
        contactPersonPhone: values.contactPersonPhone,
      });

      showToast("Customer updated successfully", "success");
      router.back();
    } catch (error: any) {
      setError("root", {
        message: error.response?.data?.message || "Failed to update customer",
      });
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="mt-3 text-gray-600">Loading customer...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Edit Customer" />
      </Appbar.Header>

      {/* Form */}
      <ScrollView className="flex-1 bg-white">
        <View className="p-5">
          {/* Section 1 */}
          <View className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-200">
            <FormDropdown
              control={control}
              name="series"
              label="Series"
              multiple={false}
              items={[{ label: "Customer", value: "1" }]}
            />

            <FormInput
              control={control}
              name="customerName"
              label="Customer Name"
              rules={{ required: "Customer Name is required" }}
            />

            <FormDropdown
              control={control}
              name="customerGroup"
              label="Customer Group"
              multiple={false}
              items={[{ label: "Domestic Receivable", value: "1" }]}
            />

            <FormDropdown
              control={control}
              name="currency"
              label="Currency"
              multiple={false}
              items={[
                { label: "Canadian Dollar", value: "1" },
                { label: "Euro", value: "2" },
                { label: "British Pound", value: "3" },
                { label: "Indian Rupee", value: "4" },
                { label: "US Dollar", value: "5" },
              ]}
            />

            <FormInput
              control={control}
              name="customerPhone"
              label="Customer Phone"
              keyboardType="phone-pad"
            />

            <FormInput
              control={control}
              name="customerMobile"
              label="Customer Mobile"
              keyboardType="phone-pad"
            />

            <FormInput control={control} name="panNumber" label="PAN Number" />

            <FormInput
              control={control}
              name="creditLimit"
              label="Credit Limit"
            />
          </View>

          {/* Address Section */}
          <View className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
            <Text className="text-lg font-semibold text-gray-800 mb-8 border-b pb-2">
              Address
            </Text>

            <FormInput control={control} name="address" label="Address" />

            <FormInput control={control} name="area" label="Area" />

            <FormInput
              control={control}
              name="city"
              label="City"
              rules={{ required: "City is required" }}
            />

            <FormInput
              control={control}
              name="pinCode"
              label="Pin Code"
              keyboardType="numeric"
            />

            <FormDropdown
              control={control}
              name="state"
              label="State"
              multiple={false}
              items={[
                { label: "India", value: "1" },
                { label: "America", value: "2" },
                { label: "Canada", value: "3" },
              ]}
            />

            <FormInput control={control} name="gstn" label="GSTN" />
          </View>

          {/* Contact Person */}
          <View className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
            <Text className="text-lg font-semibold text-gray-800 mb-8 border-b pb-2">
              Contact Person
            </Text>

            <FormInput
              control={control}
              name="contactPersonName"
              label="Contact Person Name"
            />

            <FormInput
              control={control}
              name="designation"
              label="Designation"
            />

            <FormInput
              control={control}
              name="contactPersonEmail"
              label="Email"
              keyboardType="email-address"
            />

            <FormInput
              control={control}
              name="contactPersonMobile"
              label="Mobile"
              keyboardType="phone-pad"
            />

            <FormInput
              control={control}
              name="contactPersonPhone"
              label="Phone"
              keyboardType="phone-pad"
            />
          </View>

          {errors.root && (
            <Text className="text-red-500 text-sm mb-4 text-center">
              {errors.root.message}
            </Text>
          )}

          <View className="gap-3 mt-4 mb-6">
            <FormButton
              variant="primary"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Update Customer
            </FormButton>

            <FormButton
              variant="outline"
              onPress={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </FormButton>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
