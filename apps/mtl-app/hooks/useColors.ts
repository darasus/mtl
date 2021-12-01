import { useColorMode, useToken } from "@chakra-ui/react";
import React from "react";

export const useColors = () => {
  const { colorMode } = useColorMode();
  const [gray50, gray1000] = useToken("colors", ["gray.50", "gray.1000"]);
  const isDark = colorMode === "dark";

  const borderColor = React.useMemo(
    () => (isDark ? "gray.900" : "gray.200"),
    [isDark]
  );

  const darkerBgColor = React.useMemo(
    () => (isDark ? gray1000 : gray50),
    [isDark, gray1000, gray50]
  );

  const secondaryTextColor = React.useMemo(
    () => (isDark ? "gray.500" : "gray.600"),
    [isDark]
  );

  const secondaryButtonTextColor = React.useMemo(
    () => (isDark ? "gray.600" : "gray.600"),
    [isDark]
  );

  const backgroundColor = React.useMemo(
    () => (isDark ? "black" : "white"),
    [isDark]
  );

  return {
    isDark,
    borderColor,
    darkerBgColor,
    secondaryTextColor,
    secondaryButtonTextColor,
    backgroundColor,
  };
};
