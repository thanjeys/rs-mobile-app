import { useState } from "react";
import { View } from "react-native";
import { Controller } from "react-hook-form";
import { TextInput, Text, IconButton } from "react-native-paper";

type Props = {
  control: any;
  name: string;
  label: string;
  rules?: any;
};

export default function FormPasswordInput({ control, name, label, rules }: Props) {
  const [show, setShow] = useState(false);

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
              secureTextEntry={!show}
              error={!!error}
              right={
                <TextInput.Icon
                  icon={show ? "eye-off" : "eye"}
                  onPress={() => setShow(!show)}
                />
              }
            />
            {error && <Text className="text-red-500 mt-1">{error.message}</Text>}
          </>
        )}
      />
    </View>
  );
}
