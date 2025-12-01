import { useState } from "react";
import { Controller } from "react-hook-form";
import { View } from "react-native";
import { Text } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";

type Props = {
  control: any;
  name: string;
  label: string;
  items: { label: string; value: string }[];
  rules?: any;
};

export default function FormDropdown({
  control,
  name,
  label,
  items,
  rules,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <View className="mb-4">
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <>
            <DropDown
              label={label}
              mode="outlined"
              visible={show}
              showDropDown={() => setShow(true)}
              onDismiss={() => setShow(false)}
              value={value}
              setValue={onChange}
              list={items}
              inputProps={{
                error: !!error,
              }}
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
