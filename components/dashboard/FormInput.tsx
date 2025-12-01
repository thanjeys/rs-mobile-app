import { Controller } from "react-hook-form";
import { View } from "react-native";
import { Text, TextInput } from "react-native-paper";

type Props = {
  control: any;
  name: string;
  label: string;
  secure?: boolean;
  rules?: any;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
};

export default function FormInput({
  control,
  name,
  label,
  secure = false,
  rules,
  keyboardType = "default",
}: Props) {
  return (
    <View className="mb-4">
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <TextInput
              label={label}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              secureTextEntry={secure}
              keyboardType={keyboardType}
              error={!!error}
            />
            {error && (
              <Text className="text-red-500 mt-1">{error.message}</Text>
            )}
          </>
        )}
      />
    </View>
  );
}
