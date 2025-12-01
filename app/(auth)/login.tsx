import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useAuthStore } from "../../lib/authStore";

import FormInput from "@/components/dashboard/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Zod Schema
const LoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Type inference for form data
type LoginFormData = z.infer<typeof LoginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();

  // React Hook Form with Zod
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: "onTouched",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Submit Handler
  const onSubmit = async (values: LoginFormData) => {
    const success = await login(values.username, values.password);

    if (success) {
      router.replace("/(main)/home");
    } else {
      setError("password", { message: "Invalid username or password" });
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-5">
      <View className="w-full bg-white p-10 rounded-lg">
        <Text className="text-center text-3xl font-semibold mb-8">Login</Text>

        <FormInput control={control} name="username" label="Username" />
        <FormInput control={control} name="password" label="Password" secure />

        {/* Submit */}
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={isSubmitting}
          className="mt-8"
        >
          Login
        </Button>
      </View>
    </View>
  );
}
