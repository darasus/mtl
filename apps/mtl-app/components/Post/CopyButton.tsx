import { Button, IconButton } from "@chakra-ui/button";
import { Text } from "@chakra-ui/layout";
import { useBreakpointValue } from "@chakra-ui/media-query";
import { DocumentDuplicateIcon } from "@heroicons/react/outline";
import React from "react";
import useCopyClipboard from "../../hooks/useClipboard";

export const CopyButton = ({ content }: { content: string }) => {
  const [isCopied, copy] = useCopyClipboard(content, {
    successDuration: 3000,
  });

  const handleClipboardCopy = React.useCallback(() => copy(), [copy]);

  const commonProps = {
    "aria-label": "Copy library button",
    onClick: handleClipboardCopy,
    disabled: isCopied,
  } as const;

  const mobileButton = (
    <IconButton
      {...commonProps}
      icon={<DocumentDuplicateIcon width="20" height="20" />}
      variant="solid"
      size="sm"
    />
  );

  const desktopButton = (
    <Button
      {...commonProps}
      leftIcon={<DocumentDuplicateIcon width="15" height="15" />}
      variant="ghost"
      size="xs"
    >
      <Text>{isCopied ? "Copied!" : "Copy"}</Text>
    </Button>
  );

  const buttonComponent = useBreakpointValue({
    base: mobileButton,
    sm: desktopButton,
  });

  if (!buttonComponent) return mobileButton;

  return buttonComponent;
};
