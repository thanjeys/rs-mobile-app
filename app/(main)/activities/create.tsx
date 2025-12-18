import FormButton from "@/components/dashboard/FormButton";
import FormDatePicker from "@/components/dashboard/FormDatePicker";
import FormDropdown from "@/components/dashboard/FormDropdown";
import FormInput from "@/components/dashboard/FormInput";
import FormTextarea from "@/components/dashboard/FormTextarea";
import { useToast } from "@/components/Toast";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import { z } from "zod";

// Zod Schema
const ActivitySchema = z
  .object({
    customerName: z.string().min(1, "Customer code is required"),

    activityID: z
      .array(z.string())
      .nonempty("Please select at least one activity type"),

    startDate: z
      .date()

      .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
        message: "Start date is required",
      }),
    endDate: z
      .date()
      .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
        message: "End date is required",
      }),
    status: z.string().min(1, "Priority is required"),
    activityDescription: z
      .string()
      .min(1, "Activity description is required")
      .min(10, "Activity description must be at least 10 characters"),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date cannot be before start date",
    path: ["endDate"],
  });

console.log("DropDown:", FormDropdown);

type ActivityFormData = z.infer<typeof ActivitySchema>;

export default function ActivityCreate() {
  const router = useRouter();
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<any>({
    resolver: zodResolver(ActivitySchema),
    mode: "onTouched",
    defaultValues: {
      customerName: "",
      activityID: [],
      startDate: null,
      endDate: null,
      status: "",
      activityDescription: "",
    },
  });

  const onSubmit = async (values: ActivityFormData) => {
    try {
      console.log("Submitting values:", values);
      const response = await api.post(
        "/create-activity",
        {
          customerName: values.customerName,
          activityID: values.activityID,
          startDate: values.startDate,
          endDate: values.endDate,
          status: values.status,
          activityDescription: values.activityDescription,
        }
      );

      showToast("Activity created successfully!", "success");
      router.back();
    } catch (error: any) {
      setError("root", {
        message: error.response?.data?.message || "Failed to create activity",
      });
    }
  };

  return (
    console.log({
      FormDropdown,
      FormInput,
      FormDatePicker,
      FormTextarea,
    }),
    (
      <View className="flex-1 bg-white">
        <View className=" border-b border-gray-200">
          <View className="text-2xl font-bold text-gray-800">
            <Appbar.Header>
              <Appbar.BackAction onPress={() => router.back()} />
              <Appbar.Content title="Create Activity" />
            </Appbar.Header>
          </View>
        </View>

        <ScrollView className="flex-1 bg-white">
          <View className="p-5">
            <FormDropdown
              control={control}
              name="customerName"
              label="Customer Code"
              multiple={false}
              items={[
                {
                  label: "Hindustan Associates",
                  value: "Hindustan Associates",
                },
                { label: "Sharath & Co", value: "Sharath & Co" },
                { label: "Global Traders", value: "Global Traders" },
              ]}
            />
            <FormDropdown
              control={control}
              name="activityID"
              label="Activity Type"
              multiple={true}
              items={[
                { label: "Phone Call", value: "32" },
                { label: "Meeting", value: "41" },
                { label: "Task", value: "27" },
                { label: "Note", value: "19" },
                { label: "Campaign", value: "58" },
                { label: "Other", value: "74" },
              ]}
            />

            <FormDatePicker
              control={control}
              name="startDate"
              label="Start Date"
              rules={{ required: "Start date is required" }}
            />
            <FormDatePicker
              control={control}
              name="endDate"
              label="End Date"
              rules={{ required: "End date is required" }}
            />

            <FormDropdown
              control={control}
              name="status"
              label="Priority"
              items={[
                { label: "Low", value: "Low" },
                { label: "Medium", value: "Medium" },
                { label: "High", value: "High" },
              ]}
              rules={{ required: "Priority is required" }}
            />

            <FormTextarea
              control={control}
              name="activityDescription"
              label="Activity Description"
              rules={{ required: "Activity description is required" }}
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
                Create Activity
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
    )
  );
}
