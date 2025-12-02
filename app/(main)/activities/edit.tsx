import { useToast } from "@/components/Toast";
import FormButton from "@/components/dashboard/FormButton";
import FormDatePicker from "@/components/dashboard/FormDatePicker";
import FormInput from "@/components/dashboard/FormInput";
import FormTextarea from "@/components/dashboard/FormTextarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import { z } from "zod";

// ⭐ Full validation kept here
const ActivitySchema = z
  .object({
    subject: z.string().min(1, "Subject is required"),
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date({ required_error: "End date is required" }),
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
  } = useForm<ActivityFormData>({
    resolver: zodResolver(ActivitySchema),
    mode: "onTouched",
  });

  // ⭐ Load data
  const fetchActivity = async () => {
    try {
      const response = await fetch(`https://dummyjson.com/comments/${id}`);
      const data = await response.json();

      reset({
        subject: `Subject of Comment #${data.id}`,
        startDate: new Date(),
        endDate: new Date(),
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

  // ⭐ Submit
  const onSubmit = async (values: ActivityFormData) => {
    try {
      console.log("Updating with values:", values);

      await fetch(`https://dummyjson.com/comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: values.subject,
          startDate: values.startDate.toISOString().split("T")[0],
          endDate: values.endDate.toISOString().split("T")[0],
          body: values.activityDescription,
        }),
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

  return (
    <View className="flex-1 bg-white">
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Update Activity" />
      </Appbar.Header>

      <ScrollView className="p-5 bg-white">
        <FormInput control={control} name="subject" label="Subject" />

        <FormDatePicker control={control} name="startDate" label="Start Date" />

        <FormDatePicker control={control} name="endDate" label="End Date" />

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

        {errors.endDate && (
          <Text className="text-red-500 text-center mt-3">
            {errors.endDate.message}
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
