import { View } from "react-native";
import { Controller } from "react-hook-form";
import { TextInput, Text } from "react-native-paper";

type Props = {
  control: any;
  name: string;
  label: string;
  rules?: any;
};

export default function FormTextarea({ control, name, label, rules }: Props) {
  return (
    <View className="mb-4">
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
          <>
            <TextInput
              label={label}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              multiline
              numberOfLines={5}
              error={!!error}
            />
            {error && <Text className="text-red-500 mt-1">{error.message}</Text>}
          </>
        )}
      />
    </View>
  );
}
