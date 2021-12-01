import React from "react";
import { Markdown } from "../Markdown";
import { Flex, Box } from "@chakra-ui/react";
import { Syntax } from "../Syntax";
import { LikeButton } from "./LikeButton";
import { Comments } from "./Comments";
import { useColors } from "../../hooks/useColors";
import { ActionMenu } from "./ActionMenu";
import { Header } from "./Header";
import { ScreenshotButton } from "./ScreenshotButton";
import { usePostQuery } from "../../hooks/query/usePostQuery";
import { CodeLanguage } from ".prisma/client";
import { TweetButton } from "./TweetButton";
import { CopyButton } from "./CopyButton";
import { OpenInRemoteCodeEditorButton } from "./OpenInRemoteCodeEditorButton";

interface Props {
  postId: string;
  isMyPost: boolean;
  showActionMenu?: boolean;
  showMetaInfo?: boolean;
  isPostLoading?: boolean;
  isPostStatusVisible?: boolean;
}

export const Post: React.FC<Props> = React.memo(function Post({
  postId,
  isMyPost,
  showActionMenu = true,
  showMetaInfo = true,
  isPostStatusVisible,
}) {
  const { data: post } = usePostQuery(postId);
  const { borderColor } = useColors();

  if (!post) return null;

  return (
    <Box borderColor={borderColor} borderWidth="thin">
      <Flex flexDirection="column">
        <Box>
          <Box borderColor={borderColor} borderBottomWidth="thin">
            <Header
              post={post}
              showMetaInfo={showMetaInfo}
              isPostStatusVisible={isPostStatusVisible}
            />
          </Box>
          {post.description && (
            <Box p={4} borderColor={borderColor} borderBottomWidth="thin">
              <Flex flexDirection="column">
                <Markdown value={post.description || ""} />
              </Flex>
            </Box>
          )}
          <Syntax
            codeLanguage={post.codeLanguage || CodeLanguage.JAVASCRIPT}
            value={post.content || ""}
          />
        </Box>
        {showActionMenu && (
          <>
            <Box borderColor={borderColor} borderTopWidth="thin">
              <Flex alignItems="center" p={4}>
                <LikeButton post={post} />
                <Box mr={2} />
                <TweetButton post={post} />
                <Box mr={2} />
                <CopyButton content={post.content as string} />
                <Box mr={2} />
                <ScreenshotButton post={post} />
                <Box mr={2} />
                <OpenInRemoteCodeEditorButton post={post} />
                <Box flexGrow={1} />
                <ActionMenu isMyPost={isMyPost} post={post} />
              </Flex>
            </Box>
            <Box>
              <Comments postId={post.id} />
            </Box>
          </>
        )}
      </Flex>
    </Box>
  );
});
