import FormButton from "@/components/dashboard/FormButton";
import FormDropdown from "@/components/dashboard/FormDropdown";
import FormInput from "@/components/dashboard/FormInput";
import { useToast } from "@/components/Toast";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import { z } from "zod";

// ---------- Zod Schema ----------
const CustomerSchema = z.object({
  customerName: z.string().min(1, "Customer Name is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  customerGroup: z.string().optional(),
  currency: z.string().optional(),
  customerPhone: z.string().optional(),
  customerMobile: z.string().optional(),
  panNumber: z.string().optional(),
  creditLimit: z.string().optional(),
  address: z.string().optional(),
  area: z.string().optional(),
  pinCode: z.string().optional(),
  gstn: z.string().optional(),
  series: z.string().optional(),
  contactPersonName: z.string().optional(),
  designation: z.string().optional(),
  contactPersonEmail: z.string().optional(),
  contactPersonMobile: z.string().optional(),
  contactPersonPhone: z.string().optional(),
});

type CustomerFormData = z.infer<typeof CustomerSchema>;

// ---------- Component ----------
export default function CustomerCreate() {
  const router = useRouter();
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(CustomerSchema),
    mode: "onTouched",
    defaultValues: {
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
      series: "",
      contactPersonName: "",
      designation: "",
      contactPersonEmail: "",
      contactPersonMobile: "",
      contactPersonPhone: "",
    },
  });

  const onSubmit = async (values: CustomerFormData) => {
    try {
      await api.post("/create-customer", values);
      showToast("Customer created successfully!", "success");
      router.back();
    } catch (error: any) {
      setError("root", {
        message: error.response?.data?.message || "Failed to create customer",
      });
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Create Customer" />
      </Appbar.Header>

      <ScrollView className="flex-1 bg-white">
        <View className="p-5">
          {/* Customer Info */}
          <View className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-200">
            <FormDropdown
              control={control}
              name="series"
              label="Series"
              multiple={false}
              items={[{ label: "Customer", value: "Customer" }]}
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
              items={[
                { label: "Domestic Receivable", value: "Domestic Receivable" },
              ]}
            />

            <FormDropdown
              control={control}
              name="currency"
              label="Currency"
              multiple={false}
              items={[
                { label: "Canadian Dollar", value: "Canadian Dollar" },
                { label: "Euro", value: "Euro" },
                { label: "British Pound", value: "British Pound" },
                { label: "Indian Rupee", value: "Indian Rupee" },
                { label: "US Dollar", value: "US Dollar" },
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

          {/* Address */}
          <View className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
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
                { label: "India", value: "India" },
                { label: "America", value: "America" },
                { label: "Canada", value: "Canada" },
              ]}
              rules={{ required: "State is required" }}
            />

            <FormInput control={control} name="gstn" label="GSTN" />
          </View>

          {/* Contact Person */}
          <View className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Contact Person
            </Text>

            <FormInput
              control={control}
              name="contactPersonName"
              label="Name"
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

          {/* Error */}
          {errors.root && (
            <Text className="text-red-500 text-sm mb-4 text-center">
              {errors.root.message}
            </Text>
          )}

          {/* Submit Buttons */}
          <View className="gap-3 mt-4 mb-6">
            <FormButton
              variant="primary"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Create Customer
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
