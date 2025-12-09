import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import {
  Text as RNText,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Chip, Text, TextInput } from "react-native-paper";

type Item = { label: string; value: string };

interface Props {
  control: any;
  name: string;
  label: string;
  items: Item[];
  rules?: any;
  multiple?: boolean;
}

export default function FormDropdown({
  control,
  name,
  label,
  items,
  rules,
  multiple = false,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);

  const isRequired = !!rules?.required; // <-- check if required

  return (
    <View style={{ marginBottom: 16, zIndex: 1000 }}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const toggleValue = (val: string) => {
            const arr = Array.isArray(value) ? value : [];
            if (arr.includes(val)) {
              onChange(arr.filter((v) => v !== val));
            } else {
              onChange([...arr, val]);
            }
          };

          const handleSelect = (val: string) => {
            if (multiple) {
              toggleValue(val);
            } else {
              onChange(val);
              const selectedItem = items.find((i) => i.value === val);
              setSearch(selectedItem ? selectedItem.label : "");
              setVisible(false);
              setFocused(false);
            }
          };

          const selectedItems = multiple
            ? items.filter(
                (i) => Array.isArray(value) && value.includes(i.value)
              )
            : value
              ? [items.find((i) => i.value === value)!]
              : [];

          const filteredItems = items.filter((i) =>
            i.label.toLowerCase().includes(search.toLowerCase())
          );

          const multiEditable = multiple && selectedItems.length === 0;

          return (
            <>
              {/* INPUT BOX */}
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  setFocused(true);
                  setVisible(true);
                  if (!multiple && selectedItems.length > 0) setSearch("");
                }}
              >
                <View
                  style={[
                    styles.inputBox,
                    { borderColor: error ? "red" : "#999" },
                  ]}
                >
                  {/* Multi-select chips inside input */}
                  {multiple && selectedItems.length > 0 && (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.chipScroll}
                    >
                      {selectedItems.map((item) => (
                        <Chip
                          key={item.value}
                          mode="outlined"
                          style={{ marginRight: 4 }}
                          onClose={() => toggleValue(item.value)}
                        >
                          {item.label}
                        </Chip>
                      ))}
                    </ScrollView>
                  )}

                  {/* Multi-select editable search only when no chips */}
                  {multiEditable && (
                    <TextInput
                      value={search}
                      onChangeText={setSearch}
                      placeholder={isRequired ? `${label} *` : label} // <-- add * if required
                      style={styles.searchInput}
                      underlineColor="transparent"
                      activeUnderlineColor="transparent"
                      onFocus={() => {
                        setFocused(true);
                        setVisible(true);
                      }}
                    />
                  )}

                  {/* Single-select as is */}
                  {!multiple &&
                    selectedItems.length > 0 &&
                    !focused &&
                    !search && (
                      <RNText style={{ fontSize: 16 }}>
                        {selectedItems[0].label}
                      </RNText>
                    )}
                  {!multiple && (
                    <TextInput
                      value={search}
                      onChangeText={setSearch}
                      placeholder={
                        selectedItems.length === 0
                          ? isRequired
                            ? `${label} *`
                            : label
                          : ""
                      }
                      style={{ flex: 1, backgroundColor: "transparent" }}
                      underlineColor="transparent"
                      activeUnderlineColor="transparent"
                      onFocus={() => {
                        setFocused(true);
                        setVisible(true);
                        setSearch(""); // clear previous value
                      }}
                    />
                  )}

                  {/* DROPDOWN ICON */}
                  <MaterialIcons
                    name={visible ? "arrow-drop-up" : "arrow-drop-down"}
                    size={24}
                    style={{ marginLeft: 4 }}
                    onPress={() => {
                      setVisible(!visible);
                      setSearch("");
                      setFocused(false);
                    }}
                  />
                </View>
              </TouchableOpacity>

              {/* DROPDOWN PANEL */}
              {visible && (
                <View style={styles.dropdownPanel}>
                  <ScrollView style={{ maxHeight: 260 }}>
                    {filteredItems.map((item) => {
                      const isSelected =
                        multiple &&
                        Array.isArray(value) &&
                        value.includes(item.value);

                      return (
                        <View key={item.value} style={styles.optionRow}>
                          {/* Checkbox for multi-select */}
                          {multiple && (
                            <TouchableOpacity
                              onPress={() => toggleValue(item.value)}
                              style={{ padding: 6 }}
                            >
                              <MaterialIcons
                                name={
                                  isSelected
                                    ? "check-box"
                                    : "check-box-outline-blank"
                                }
                                size={22}
                              />
                            </TouchableOpacity>
                          )}

                          {/* Text – selects option */}
                          <TouchableOpacity
                            onPress={() => handleSelect(item.value)}
                            style={{ flex: 1, paddingVertical: 10 }}
                          >
                            <RNText style={{ fontSize: 16 }}>
                              {item.label}
                            </RNText>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              {/* ERROR MESSAGE */}
              {error && (
                <Text style={{ color: "red", marginTop: 4 }}>
                  {error.message}
                </Text>
              )}
            </>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputBox: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    minHeight: 55,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: "white",
  },
  chipScroll: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    padding: 0,
    margin: 0,
    backgroundColor: "transparent",
  },
  dropdownPanel: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    backgroundColor: "white",
    marginTop: 4,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
  },
});
