import { CodeLanguage } from ".prisma/client";
import { Button, IconButton } from "@chakra-ui/button";
import { Text } from "@chakra-ui/layout";
import { useBreakpointValue } from "@chakra-ui/media-query";
import { LightningBoltIcon } from "@heroicons/react/outline";
import { useOpenInRemoveCodeEditor } from "../../hooks/useOpenInRemoveCodeEditor";
import { Post } from "../../types/Post";

export const OpenInRemoteCodeEditorButton = ({ post }: { post: Post }) => {
  const onClick = useOpenInRemoveCodeEditor({
    codeLanguage: post.codeLanguage as CodeLanguage,
    title: post.title,
    content: post.content as string,
    description: post.description as string,
    tags: post.tags.map((tag) => tag.tag.name),
  });

  const commonProps = {
    onClick,
    "aria-label": "Open in remote code editor",
  } as const;

  const mobileButton = (
    <IconButton
      {...commonProps}
      icon={<LightningBoltIcon width="20" height="20" />}
      variant="solid"
      size="sm"
    />
  );

  const desktopButton = (
    <Button
      {...commonProps}
      leftIcon={<LightningBoltIcon width="15" height="15" />}
      variant="ghost"
      size="xs"
    >
      <Text>StackBlitz</Text>
    </Button>
  );

  const buttonComponent = useBreakpointValue({
    base: mobileButton,
    sm: desktopButton,
  });

  if (!buttonComponent) return mobileButton;

  return buttonComponent;
};
