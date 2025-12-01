import { useState } from "react";
import { Controller } from "react-hook-form";
import { View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";

type Props = {
  control: any;
  name: string;
  label: string;
  rules?: any;
};

export default function FormDatePicker({ control, name, label, rules }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <View className="mb-4">
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <>
            <TextInput
              label={label}
              value={value ? new Date(value).toDateString() : ""}
              onFocus={() => setOpen(true)}
              showSoftInputOnFocus={false}
              error={!!error}
            />

            <DatePickerModal
              locale="en"
              mode="single"
              visible={open}
              onDismiss={() => setOpen(false)}
              date={value ? new Date(value) : undefined}
              onConfirm={({ date }) => {
                setOpen(false);
                onChange(date?.toISOString());
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
