import { Snackbar } from "react-native-paper";
import { create } from "zustand";

interface ToastState {
  visible: boolean;
  message: string;
  type: "success" | "error" | "info";
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  hideToast: () => void;
}

export const useToast = create<ToastState>((set) => ({
  visible: false,
  message: "",
  type: "info",
  showToast: (message, type = "info") => set({ visible: true, message, type }),
  hideToast: () => set({ visible: false }),
}));

export default function Toast() {
  const { visible, message, type, hideToast } = useToast();

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "#4CAF50";
      case "error":
        return "#F44336";
      case "info":
      default:
        return "#2196F3";
    }
  };

  return (
    <Snackbar
      visible={visible}
      onDismiss={hideToast}
      duration={3000}
      style={{ backgroundColor: getBackgroundColor() }}
      action={{
        label: "Close",
        onPress: hideToast,
      }}
    >
      {message}
    </Snackbar>
  );
}
