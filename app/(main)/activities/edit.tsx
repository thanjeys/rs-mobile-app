import { useToast } from "@/components/Toast";
import FormButton from "@/components/dashboard/FormButton";
import FormDatePicker from "@/components/dashboard/FormDatePicker";
import FormDropdown from "@/components/dashboard/FormDropdown";
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
    customerName: z.string().min(1, "Customer code is required"),

    activityID: z
      .array(z.string())
      .nonempty("Please select at least one activity type"),

    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    status: z.string().min(1, "Priority is required"),

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
  const { activityID } = useLocalSearchParams();
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
    defaultValues: {
      customerName: "",
      activityID: [],
      startDate: null, // <-- change from undefined to null
      endDate: null, // <-- change from undefined to null
      status: "",
      activityDescription: "",
    },
  });

  // ---------- Load Activity ----------
  const fetchActivity = async () => {
    try {
      const response = await api.get(`/activity/${activityID}`);
      const data = response.data[0];

      reset({
        customerName: data.customerName ?? "",
        activityID: data.activityID ? [String(data.activityID)] : [], // form expects array

        startDate: data.StartDate ? new Date(data.StartDate) : null, // <-- null
        endDate: data.EndDate ? new Date(data.EndDate) : null,

        status: data.status ? String(data.status) : "",

        activityDescription: data.activityDescription ?? "",
      });

      setLoading(false);
    } catch (error) {
      showToast("Failed to load activity", "error");
      router.back();
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [activityID]);

  // ---------- Submit ----------
  const onSubmit: SubmitHandler<ActivityFormData> = async (values) => {
    try {
      await api.put(`/update-activity/${activityID}`, {
        customerName: values.customerName,
        activityID: values.activityID,
        startDate: values.startDate.toISOString().split("T")[0],
        endDate: values.endDate.toISOString().split("T")[0],
        status: values.status,
        activityDescription: values.activityDescription,
      });

      showToast("Activity updated successfully!", "success");
      //   router.back();
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
          name="customerName"
          label="Customer Code"
          multiple={false}
          items={[
            { label: "Hindustan Associates", value: "Hindustan Associates" },
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
