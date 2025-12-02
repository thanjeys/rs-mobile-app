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

// Format date as DD/MM/YYYY
const formatDate = (date: Date) => {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
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
              value={value ? formatDate(value) : ""} // ✔ format date safely
              onFocus={() => setOpen(true)}
              showSoftInputOnFocus={false}
              error={!!error}
              right={
                <TextInput.Icon icon="calendar" onPress={() => setOpen(true)} />
              }
            />

            <DatePickerModal
              locale="en"
              mode="single"
              visible={open}
              onDismiss={() => setOpen(false)}
              date={value || new Date()} // ✔ pass Date object
              onConfirm={({ date }) => {
                setOpen(false);
                onChange(date); // ✔ store Date object
              }}
              onChange={({ date }) => {
                if (date) {
                  onChange(date);
                  setOpen(false); // auto-close on selection
                }
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
