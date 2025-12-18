import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Animated, Easing, TouchableOpacity, View } from "react-native";
import { Portal, Surface } from "react-native-paper";

export type DropdownMenuItem = {
  title: string;
  onPress: () => void;
  textColor?: string;
  icon?: ReactNode;
};

type Props = {
  anchor: ReactNode;
  items: DropdownMenuItem[];
  menuSpacing?: number; // space below header
};

export default function DropdownMenu({
  anchor,
  items,
  menuSpacing = 4,
}: Props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuTop, setMenuTop] = useState(0);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const anchorRef = useRef<View | null>(null);

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => setMenuVisible(false));
    } else {
      anchorRef.current?.measureInWindow(
        (_x: number, y: number, _w: number, h: number) => {
          setMenuTop(y + h + menuSpacing);
          setMenuVisible(true);
        }
      );
    }
  };

  useEffect(() => {
    if (menuVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [menuVisible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-15, 0],
  });

  return (
    <>
      <TouchableOpacity ref={anchorRef} onPress={toggleMenu} activeOpacity={1}>
        {anchor}
      </TouchableOpacity>

      <Portal>
        {menuVisible && (
          <Animated.View
            style={{
              position: "absolute",
              top: menuTop,
              left: 0,
              right: 0, // ✅ FULL WIDTH
              backgroundColor: "white",
              elevation: 6,
              opacity: fadeAnim,
              transform: [{ translateY }],
            }}
          >
            <Surface>
              {items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderBottomWidth: index !== items.length - 1 ? 1 : 0,
                    borderColor: "#eee",
                  }}
                  onPress={async () => {
                    await item.onPress();
                    toggleMenu();
                  }}
                >
                  <Animated.Text
                    style={{
                      fontSize: 16,
                      color: item.textColor || "#000",
                    }}
                  >
                    {item.title}
                  </Animated.Text>
                </TouchableOpacity>
              ))}
            </Surface>
          </Animated.View>
        )}
      </Portal>
    </>
  );
}
