import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import { z } from "zod";
import FormButton from "../../../components/dashboard/FormButton";
import FormInput from "../../../components/dashboard/FormInput";
import { useToast } from "../../../components/Toast";
import api from "../../../lib/api";

// Zod Schema
const CustomerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  age: z.string().min(1, "Age is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
});

type CustomerFormData = z.infer<typeof CustomerSchema>;

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
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      age: "",
      address: "",
      city: "",
      state: "",
    },
  });

  const onSubmit = async (values: CustomerFormData) => {
    try {
      const response = await api.post("/users/add", {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        age: parseInt(values.age),
        address: {
          address: values.address,
          city: values.city,
          state: values.state,
        },
      });

      showToast("Customer created successfully!", "success");
      router.back();
    } catch (error: any) {
      setError("root", {
        message: error.response?.data?.message || "Failed to create customer",
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-5">
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          Create Customer
        </Text>

        <FormInput
          control={control}
          name="firstName"
          label="First Name"
          rules={{ required: "First name is required" }}
        />

        <FormInput
          control={control}
          name="lastName"
          label="Last Name"
          rules={{ required: "Last name is required" }}
        />

        <FormInput
          control={control}
          name="email"
          label="Email"
          keyboardType="email-address"
          rules={{ required: "Email is required" }}
        />

        <FormInput
          control={control}
          name="phone"
          label="Phone"
          keyboardType="phone-pad"
          rules={{ required: "Phone is required" }}
        />

        <FormInput
          control={control}
          name="age"
          label="Age"
          keyboardType="numeric"
          rules={{ required: "Age is required" }}
        />

        <FormInput
          control={control}
          name="address"
          label="Address"
          rules={{ required: "Address is required" }}
        />

        <FormInput
          control={control}
          name="city"
          label="City"
          rules={{ required: "City is required" }}
        />

        <FormInput
          control={control}
          name="state"
          label="State"
          rules={{ required: "State is required" }}
        />

        {/* Error Message */}
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
  );
}
