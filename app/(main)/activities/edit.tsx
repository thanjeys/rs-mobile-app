import { useToast } from "@/components/Toast";
import FormButton from "@/components/dashboard/FormButton";
import FormDatePicker from "@/components/dashboard/FormDatePicker";
import FormDropdown from "@/components/dashboard/FormDropdown";
import FormInput from "@/components/dashboard/FormInput";
import FormTextarea from "@/components/dashboard/FormTextarea";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import { z } from "zod";

// ---------- Validation ----------
const ActivitySchema = z
  .object({
    customerCode: z.string().min(1, "Customer code is required"),

    activityType: z
      .array(z.string())
      .nonempty("Please select at least one activity type"),

    subject: z.string().min(1, "Subject is required"),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    priority: z.string().min(1, "Priority is required"),

    activityDescription: z
      .string()
      .min(1, "Activity description is required")
      .min(10, "Activity description must be at least 10 characters"),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date cannot be before start date",
    path: ["endDate"],
  });

type ActivityFormData = z.infer<typeof ActivitySchema>;

// ---------- Component ----------
export default function ActivityEdit() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<any>({
    resolver: zodResolver(ActivitySchema),
    mode: "onTouched",
  });

  // ---------- Load Activity ----------
  const fetchActivity = async () => {
    try {
      const response = await api.get(`/comments/${id}`);
      const data = response.data;

      reset({
        customerCode: "",
        activityType: [],
        subject: `Subject of Comment #${data.id}`,
        startDate: new Date(),
        endDate: new Date(),
        priority: "",
        activityDescription: data.body,
      });

      setLoading(false);
    } catch (error) {
      showToast("Failed to load activity", "error");
      router.back();
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [id]);

  // ---------- Submit ----------
  const onSubmit: SubmitHandler<ActivityFormData> = async (values) => {
    try {
      await api.put(`/comments/update/${id}`, {
        customerCode: values.activityDescription,
        activityType: values.activityDescription,
        subject: values.subject,
        startDate: values.startDate.toISOString().split("T")[0],
        endDate: values.endDate.toISOString().split("T")[0],
        priority: values.activityDescription,
        body: values.activityDescription,
      });

      showToast("Activity updated successfully!", "success");
      router.back();
    } catch (error) {
      setError("root", { message: "Failed to update activity" });
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-gray-600">Loading activity…</Text>
      </View>
    );
  }

  // ---------- Render Form ----------
  return (
    <View className="flex-1 bg-white">
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Update Activity" />
      </Appbar.Header>

      <ScrollView className="p-5 bg-white">
        <FormDropdown
          control={control}
          name="customerCode"
          label="Customer Code"
          multiple={false}
          items={[
            { label: "Hindustan Associates", value: "1" },
            { label: "Sharath & Co", value: "2" },
            { label: "Global Traders", value: "3" },
          ]}
        />
        <FormDropdown
          control={control}
          name="activityType"
          label="Activity Type"
          multiple={true}
          items={[
            { label: "Phone Call", value: "1" },
            { label: "Meeting", value: "2" },
            { label: "Task", value: "3" },
            { label: "Note", value: "4" },
            { label: "Campaign", value: "5" },
            { label: "Other", value: "6" },
          ]}
        />

        <FormInput control={control} name="subject" label="Subject" />

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
          name="priority"
          label="Priority"
          items={[
            { label: "Low", value: "1" },
            { label: "Medium", value: "2" },
            { label: "High", value: "3" },
          ]}
        />

        <FormTextarea
          control={control}
          name="activityDescription"
          label="Activity Description"
        />

        {errors.root && (
          <Text className="text-red-500 text-center mt-3">
            {errors.root.message}
          </Text>
        )}

        <View className="gap-3 mt-5 mb-8">
          <FormButton
            variant="primary"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
          >
            Update Activity
          </FormButton>

          <FormButton variant="outline" onPress={() => router.back()}>
            Cancel
          </FormButton>
        </View>
      </ScrollView>
    </View>
  );
}
