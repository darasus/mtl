import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { cssVar } from "@chakra-ui/styled-system";

const config: ThemeConfig = {
  useSystemColorMode: true,
};

const token = {
  color: {
    brand: "#6d28d9",
  },
};

export const theme = extendTheme({
  config,
  shadows: {
    outline: `0 0 0 2px ${token.color.brand + "50"}`,
  },
  colors: {
    brand: token.color.brand,
    gray: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#eeeeee",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
      1000: "#0a0a0a",
    },
  },
  styles: {
    global: (props: any) => ({
      "html, body": {
        color: props.colorMode === "dark" ? "white" : "black",
        background: props.colorMode === "dark" ? "black" : "white",
      },
      ".markdown > *:first-of-type, .markdown > *:last-child": {
        marginBottom: 0,
      },
    }),
    focusBorderColor: "brand.500",
  },
  components: {
    Heading: {
      baseStyle: {
        fontFamily: "Fira Code, monospace",
      },
    },
    Button: {
      variants: {
        cta: {
          bg: `${token.color.brand}CC`,
          color: "white",
          _hover: {
            bg: `${token.color.brand}`,
          },
        },
        red: {
          bg: "red.500",
          color: "white",
          // _hover: {
          //   bg: `${token.color.brand}`,
          // },
        },
      },
    },
    Menu: {
      baseStyle: (props: any) => ({
        list: {
          bg: props.colorMode === "dark" ? "black" : "white",
          borderColor: props.colorMode === "dark" ? "gray.900" : "gray.200",
        },
        item: {
          fontSize: "sm",
        },
      }),
    },
    Input: {
      defaultProps: {
        focusBorderColor: token.color.brand + "50",
      },
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: token.color.brand + "50",
      },
    },
    Tooltip: {
      baseStyle: (props: any) => {
        const $bg = cssVar("tooltip-bg");
        const $arrowBg = cssVar("popper-arrow-bg");

        return {
          bg: props.colorMode === "dark" ? "white" : "black",
          [$arrowBg.variable]: props.colorMode === "dark" ? "white" : "black",
          color: props.colorMode === "dark" ? "black" : "white",
        };
      },
    },
  },
});
