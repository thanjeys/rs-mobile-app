import { useState } from "react";
import { Controller } from "react-hook-form";
import { Text, View } from "react-native";
import { TextInput } from "react-native-paper";

type Props = {
  control: any;
  name: string;
  label: string;
  rules?: any;
};

export default function FormPasswordInput({
  control,
  name,
  label,
  rules,
}: Props) {
  const [show, setShow] = useState(false);

  // Check if required
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
              label={isRequired ? `${label} *` : label} // <-- add * only if required
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
            {error && (
              <Text className="text-red-500 mt-1">{error.message}</Text>
            )}
          </>
        )}
      />
    </View>
  );
}
