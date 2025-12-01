import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useAuthStore } from "../../lib/authStore";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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

        {/* Username */}
        <View className="mb-4">
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Username"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                autoCapitalize="none"
                error={!!errors.username}
              />
            )}
          />
          {errors.username && (
            <Text className="text-red-500 mt-1">{errors.username.message}</Text>
          )}
        </View>

        {/* Password */}
        <View className="mb-4">
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Password"
                secureTextEntry
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={!!errors.password}
              />
            )}
          />
          {errors.password && (
            <Text className="text-red-500 mt-1">{errors.password.message}</Text>
          )}
        </View>

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
