import { Controller } from "react-hook-form";
import { View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";

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
  const isRequired = !!rules?.required;

  return (
    <View className="mb-4">
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => {
          const finalLabel = isRequired ? `${label} *` : label;
          return (
            <>
              <TextInput
                label={finalLabel}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                secureTextEntry={secure}
                keyboardType={keyboardType}
                error={!!error}
              />
              <HelperText type="error" visible={!!error}>
                {error?.message}
              </HelperText>
            </>
          );
        }}
      />
    </View>
  );
}
