import { ButtonProps, Button as PaperButton } from "react-native-paper";

interface FormButtonProps extends ButtonProps {
  variant?: "primary" | "secondary" | "outline";
}

export default function FormButton({
  variant = "primary",
  children,
  ...props
}: FormButtonProps) {
  const getButtonColors = () => {
    switch (variant) {
      case "primary":
        return {
          mode: "contained" as const,
          buttonColor: "#7B68A6",
        };
      case "secondary":
        return {
          mode: "contained" as const,
          buttonColor: "#A5D8DD",
        };
      case "outline":
        return {
          mode: "outlined" as const,
          textColor: "#7B68A6",
        };
      default:
        return {
          mode: "contained" as const,
          buttonColor: "#7B68A6",
        };
    }
  };

  const colors = getButtonColors();

  return (
    <PaperButton {...colors} className="py-1" {...props}>
      {children}
    </PaperButton>
  );
}
