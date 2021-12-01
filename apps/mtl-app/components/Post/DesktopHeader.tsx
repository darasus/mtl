import { Box, Flex, Text, useBreakpoint, Tooltip } from "@chakra-ui/react";
import { Post as PostType } from "../../types/Post";
import { ThumbUpIcon, ChatIcon, TagIcon } from "@heroicons/react/outline";
import { StatusOnlineIcon, StatusOfflineIcon } from "@heroicons/react/solid";
import React from "react";
import { PostUserPreview } from "../PostUserPreview";
import { RouterLink } from "../RouterLinkt";
import { useColors } from "../../hooks/useColors";
import { CodeLanguageIcon } from "./CodeLanguageIcon";
import { useMe } from "../../hooks/useMe";
import { CodeLanguage } from ".prisma/client";

interface Props {
  post: PostType;
  showMetaInfo?: boolean;
  isPostStatusVisible?: boolean;
}

export const DesktopHeader: React.FC<Props> = React.memo(
  function DesktopHeader({
    post,
    showMetaInfo = true,
    isPostStatusVisible = false,
  }) {
    const me = useMe();
    const { secondaryTextColor } = useColors();
    const breakpoint = useBreakpoint();
    const isMetaInfoVisible = breakpoint !== "base" && showMetaInfo;
    const isMyPost = me?.user?.id === post?.authorId;

    return (
      <Box p={4}>
        <Flex alignItems="center">
          <Flex mr={2}>
            <CodeLanguageIcon
              codeLanguage={post.codeLanguage as CodeLanguage}
            />
          </Flex>
          <Flex alignItems="center" pr={2} maxWidth="100%" minWidth="0">
            <Box maxWidth="100%">
              <RouterLink href={`/p/${post.id}`}>
                <Text
                  fontSize="sm"
                  data-testid="post-title"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {post.title}
                </Text>
              </RouterLink>
            </Box>
          </Flex>
          <Flex alignItems="center" flexShrink={1}>
            <Box mr={2}>
              <Text fontSize="sm">by</Text>
            </Box>
            <Box mr={2}>
              {post.author && <PostUserPreview user={post.author} />}
            </Box>
          </Flex>
          {isMetaInfoVisible && (
            <Flex flexShrink={1}>
              <Box mr={2}>
                <Flex color={secondaryTextColor}>
                  <Flex mr={2} alignItems="center">
                    <Box mr={1}>
                      <ThumbUpIcon width="15" height="15" />
                    </Box>
                    <Box>
                      <Text
                        whiteSpace="nowrap"
                        fontSize="sm"
                      >{`${post.likesCount} likes`}</Text>
                    </Box>
                  </Flex>
                  <Flex alignItems="center" mr={2}>
                    <Box mr={1}>
                      <ChatIcon width="15" height="15" />
                    </Box>
                    <Box>
                      <Text
                        fontSize="sm"
                        whiteSpace="nowrap"
                      >{`${post.commentsCount} comments`}</Text>
                    </Box>
                  </Flex>
                  <Flex alignItems="center">
                    <Box mr={1}>
                      <TagIcon width="15" height="15" />
                    </Box>
                    <Box>
                      <Text fontSize="sm" whiteSpace="nowrap">{`${post.tags
                        .map((tag) => tag.tag.name)
                        .join(",")}`}</Text>
                    </Box>
                  </Flex>
                </Flex>
              </Box>
            </Flex>
          )}
          {isPostStatusVisible && isMyPost && (
            <>
              <Flex flexGrow={1} />
              <Flex>
                {post.published ? (
                  <Tooltip label="Published" placement="top" hasArrow>
                    <Box color="green.500">
                      <StatusOnlineIcon width="15px" height="15px" />
                    </Box>
                  </Tooltip>
                ) : (
                  <Tooltip label="Draft" placement="top" hasArrow>
                    <Box color="yellow.500">
                      <StatusOfflineIcon width="15px" height="15px" />
                    </Box>
                  </Tooltip>
                )}
              </Flex>
            </>
          )}
        </Flex>
      </Box>
    );
  }
);
