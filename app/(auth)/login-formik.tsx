import { useRouter } from "expo-router";
import { useFormik } from "formik";
import { StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import * as Yup from "yup";
import { useAuthStore } from "../../lib/authStore";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();

  // 1️⃣ Yup Validation
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // 2️⃣ Initial Values
  const initialValues = {
    email: "",
    password: "",
  };

  // 3️⃣ Submit Handler
  const handleSubmitForm = async (values, { setSubmitting, setErrors }) => {
    const success = await login(values.email, values.password);

    if (success) {
      router.replace("/(main)/home");
    } else {
      setErrors({ password: "Invalid email or password" });
    }

    setSubmitting(false);
  };

  // 4️⃣ Formik Hook
  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: handleSubmitForm,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Email Field */}
      <View style={styles.inputContainer}>
        <TextInput
          label="Email"
          value={formik.values.email}
          onChangeText={formik.handleChange("email")}
          onBlur={formik.handleBlur("email")}
          keyboardType="email-address"
          autoCapitalize="none"
          error={formik.touched.email && !!formik.errors.email}
        />
        {formik.touched.email && formik.errors.email && (
          <Text style={styles.errorText}>{formik.errors.email}</Text>
        )}
      </View>

      {/* Password Field */}
      <View style={styles.inputContainer}>
        <TextInput
          label="Password"
          secureTextEntry
          value={formik.values.password}
          onChangeText={formik.handleChange("password")}
          onBlur={formik.handleBlur("password")}
          error={formik.touched.password && !!formik.errors.password}
        />
        {formik.touched.password && formik.errors.password && (
          <Text style={styles.errorText}>{formik.errors.password}</Text>
        )}
      </View>

      {/* Submit Button */}
      <Button
        mode="contained"
        onPress={() => formik.handleSubmit()}
        loading={formik.isSubmitting}
        disabled={formik.isSubmitting}
        style={styles.button}
      >
        Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  errorText: {
    color: "#ef4444",
    marginTop: 4,
    textAlign: "center",
    fontSize: 14,
  },
  button: {
    marginTop: 16,
  },
});
