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
import { z } from "zod";

// Zod Schema
const ActivitySchema = z
  .object({
    customerCode: z.string().min(1, "Customer code is required"),
    //activityType: z.string().min(1, "Activity type is required"),
    subject: z.string().min(1, "Subject is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    //priority: z.string().min(1, "Priority is required"),
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
  } = useForm<ActivityFormData>({
    resolver: zodResolver(ActivitySchema),
    mode: "onTouched",
    defaultValues: {
      //  customerCode: "",
      //  activityType: "",
      subject: "",
      startDate: "",
      endDate: "",
      //  priority: "",
      activityDescription: "",
    },
  });

  const onSubmit = async (values: ActivityFormData) => {
    try {
      console.log("Submitting values:", values);
      const response = await api.post("/users/add", {
        customerCode: values.customerCode,
        //activityType: values.activityType,
        subject: values.subject,
        startDate: values.startDate,
        endDate: values.endDate,
        //priority: values.priority,
        activityDescription: values.activityDescription,
      });

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
      <ScrollView className="flex-1 bg-white">
        <View className="p-5">
          <Text className="text-2xl font-bold text-gray-800 mb-6">
            Create Activity
          </Text>
          {/*  <FormDropdown
            control={control}
            name="customerCode"
            label="Customer Code"
            items={[
              { label: "Hindustan Associates", value: "1" },
              { label: "Sharath & Co", value: "2" },
              { label: "Global Traders", value: "3" },
              { label: "Alpha Enterprises", value: "4" },
              { label: "Beta Solutions", value: "5" },
            ]}
          />
          <FormDropdown
            control={control}
            name="activityType"
            label="Activity Type"
            items={[
              { label: "Phone Call", value: "1" },
              { label: "Meeting", value: "2" },
              { label: "Task", value: "3" },
              { label: "Note", value: "4" },
              { label: "Campaign", value: "5" },
              { label: "Other", value: "6" },
            ]}
          />
 */}
          <FormInput
            control={control}
            name="subject"
            label="Subject"
            rules={{ required: "Subject is required" }}
          />

          <FormDatePicker
            control={control}
            name="startDate"
            label="Start Date"
          />
          <FormDatePicker control={control} name="endDate" label="End Date" />

          {/*           <FormDropdown
            control={control}
            name="priority"
            label="Priority"
            items={[
              { label: "Low", value: "1" },
              { label: "Medium", value: "2" },
              { label: "High", value: "3" },
            ]}
          />
 */}
          <FormTextarea
            control={control}
            name="activityDescription"
            label="Activity Description"
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
    )
  );
}
