import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import { useColorMode } from "@chakra-ui/react";
import darkTheme from "prism-react-renderer/themes/vsDark";
import lightTheme from "prism-react-renderer/themes/vsLight";
import { CodeLanguage } from ".prisma/client";
import { langMap } from "./CodeEditor";

interface Props {
  value: string;
  slice?: number;
  codeLanguage: CodeLanguage;
}

export const Syntax: React.FC<Props> = ({ value, codeLanguage, slice }) => {
  const { colorMode } = useColorMode();
  const theme = {
    ...(colorMode === "dark" ? darkTheme : lightTheme),
  };
  const language = langMap[codeLanguage];

  return (
    <Highlight {...defaultProps} theme={theme} code={value} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => {
        const newTokens = slice ? [...tokens.slice(0, slice)] : tokens;

        return (
          <pre
            className={className}
            style={{
              ...style,
              padding: "10px 20px",
              marginTop: 0,
              marginBottom: 0,
              overflow: "scroll",
              fontFamily: "Fira Code, monospace",
              backgroundColor: "transparent",
            }}
          >
            {newTokens.map((line, i) => {
              return (
                // eslint-disable-next-line react/jsx-key
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => {
                    // eslint-disable-next-line react/jsx-key
                    return <span {...getTokenProps({ token, key })} />;
                  })}
                </div>
              );
            })}
          </pre>
        );
      }}
    </Highlight>
  );
};
