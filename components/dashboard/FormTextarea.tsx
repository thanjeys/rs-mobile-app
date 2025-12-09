import { Controller } from "react-hook-form";
import { View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";

type Props = {
  control: any;
  name: string;
  label: string;
  rules?: any;
};

export default function FormTextarea({ control, name, label, rules }: Props) {
  const isRequired = !!rules?.required;

  return (
    <View className="mb-4">
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <>
            <TextInput
              mode="outlined"
              label={isRequired ? `${label} *` : label} // ⭐ label inside
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              multiline
              numberOfLines={5}
              error={!!error}
            />

            <HelperText type="error" visible={!!error}>
              {error?.message}
            </HelperText>
          </>
        )}
      />
    </View>
  );
}
