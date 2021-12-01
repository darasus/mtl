import { useColorMode } from "@chakra-ui/react";
import Image from "next/image";

export const Logo = () => {
  const { colorMode } = useColorMode();

  return (
    <Image
      id="logo"
      src={colorMode === "dark" ? "/logo-light.svg" : "/logo-dark.svg"}
      height="30"
      width={130}
      alt="Logo"
      priority
    />
  );
};
