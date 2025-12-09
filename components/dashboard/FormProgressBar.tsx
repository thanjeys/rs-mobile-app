// FormProgressBar.tsx
import React from "react";
import { Text, View } from "react-native";
import { ProgressBar } from "react-native-paper";

type Props = {
  completed: number;
  total: number;
  label?: string; // optional text above bar
  showPercentage?: boolean; // optional percentage
};

export default function FormProgressBar({
  completed,
  total,
  label,
  showPercentage = true,
}: Props) {
  const progress = total > 0 ? completed / total : 0;
  const percentage = Math.round(progress * 100);

  // Dynamic color based on progress
  const color = progress < 0.4 ? "red" : progress < 0.7 ? "orange" : "green";

  return (
    <View style={{ marginVertical: 10 }}>
      {label && <Text style={{ marginBottom: 6 }}>{label}</Text>}

      <ProgressBar
        progress={progress}
        color={color}
        style={{ height: 10, borderRadius: 5 }}
      />

      {showPercentage && (
        <Text style={{ marginTop: 0, fontSize: 13, opacity: 0.7 }}>
          {completed} / {total} ({percentage}%)
        </Text>
      )}
    </View>
  );
}
