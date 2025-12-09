import * as Linking from "expo-linking"; // Or import { Linking } from "react-native";
import React from "react";
import { Alert, View } from "react-native";
import { IconButton } from "react-native-paper";

type Props = {
  email?: string;
  phone?: string;
  sms?: string;
};

export default function ContactIcons({ email, phone, sms }: Props) {
  const handleEmailPress = () => {
    if (!email) return;
    Linking.openURL(`mailto:${email}`).catch(() =>
      Alert.alert("Error", "Unable to open mail app")
    );
  };

  const handlePhonePress = () => {
    if (!phone) return;
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert("Error", "Unable to open phone dialer")
    );
  };

  const handleSmsPress = () => {
    if (!sms) return;
    Linking.openURL(`sms:${sms}`).catch(() =>
      Alert.alert("Error", "Unable to open messaging app")
    );
  };

  return (
    <View style={{ flexDirection: "row", gap: 0 }}>
      <IconButton
        icon="email"
        size={20}
        onPress={handleEmailPress}
        accessibilityLabel="Send Email"
      />
      <IconButton
        icon="message"
        size={20}
        onPress={handleSmsPress}
        accessibilityLabel="Send SMS"
      />
      <IconButton
        icon="phone"
        size={20}
        onPress={handlePhonePress}
        accessibilityLabel="Call Phone"
      />
    </View>
  );
}
