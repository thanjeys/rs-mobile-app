import { useState } from "react";
import { Controller } from "react-hook-form";
import { Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";

type Props = {
  control: any;
  name: string;
  label: string;
  rules?: any;
};

// Helpers
const parseDate = (str: string): Date | null => {
  const [day, month, year] = str.split("-").map(Number);
  if (!day || !month || !year) return null;
  const date = new Date(year, month - 1, day);
  return isNaN(date.getTime()) ? null : date;
};

const formatDate = (date: Date) => {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
};

const validateDateParts = (str: string) => {
  const [day, month, year] = str.split("-").map(Number);
  if (!day || day < 1 || day > 31) return "Invalid day (DD)";
  if (!month || month < 1 || month > 12) return "Invalid month (MM)";
  if (!year || year < 1900 || year > 2100) return "Invalid year (YYYY)";
  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) return "Invalid date";
  return "";
};

export default function FormDatePicker({ control, name, label, rules }: Props) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [customError, setCustomError] = useState("");

  // Check if required
  const isRequired = !!rules?.required;

  return (
    <View style={{ marginBottom: 16 }}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <>
            <TextInput
              mode="outlined"
              // Add * only if required
              label={isRequired ? `${label} *` : label}
              value={inputValue}
              placeholder=""
              error={!!error || !!customError}
              showSoftInputOnFocus={true}
              onChangeText={(text) => {
                setInputValue(text);

                if (!text) {
                  setCustomError("");
                  onChange(null);
                  return;
                }

                const partError = validateDateParts(text);
                if (partError) {
                  setCustomError(partError);
                  onChange(null);
                } else {
                  setCustomError("");
                  const parsed = parseDate(text);
                  if (parsed) onChange(parsed);
                }
              }}
              right={
                <TextInput.Icon icon="calendar" onPress={() => setOpen(true)} />
              }
            />

            <Text style={{ color: "#666", fontSize: 12, marginTop: 2 }}>
              DD-MM-YYYY
            </Text>

            <DatePickerModal
              locale="en"
              mode="single"
              visible={open}
              date={value || undefined}
              onDismiss={() => setOpen(false)}
              onConfirm={({ date }) => {
                if (date) {
                  setInputValue(formatDate(date));
                  onChange(date);
                  setCustomError("");
                  setOpen(false);
                }
              }}
              startYear={1900}
              endYear={2100}
              label={label}
            />

            {(error || customError) && (
              <Text style={{ color: "red", marginTop: 4 }}>
                {error?.message || customError}
              </Text>
            )}
          </>
        )}
      />
    </View>
  );
}
