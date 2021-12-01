import React from "react";
import { usePostQuery } from "../../../hooks/query/usePostQuery";
import { useRouter } from "next/router";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Logo } from "../../../components/Logo";
import { ThumbnailLayout } from "../../../layouts/ThumbnailLayout";
import { Syntax } from "../../../components/Syntax";
import { useColors } from "../../../hooks/useColors";
import { CodeLanguageIcon } from "../../../components/Post/CodeLanguageIcon";
import Image from "next/image";
import { CodeLanguage } from ".prisma/client";
import { GetServerSideProps } from "next";

const ThumbnailPage: React.FC = () => {
  const router = useRouter();
  const { data: post } = usePostQuery(router.query.id as string);
  const { borderColor } = useColors();

  if (!post) return null;

  return (
    <ThumbnailLayout>
      <main>
        <Box borderColor={borderColor} borderWidth="thin">
          <Flex flexDirection="column">
            <Box>
              <Box borderColor={borderColor} borderBottomWidth="thin">
                <Box p={4}>
                  <Flex alignItems="center" width="100%">
                    {post.codeLanguage && (
                      <Box mr={4}>
                        <CodeLanguageIcon
                          width={12}
                          height={12}
                          fontSize="3xl"
                          codeLanguage={post.codeLanguage}
                        />
                      </Box>
                    )}
                    <Box mr={4} minWidth={0}>
                      <Text fontSize="3xl" data-testid="post-title" isTruncated>
                        {post.title}
                      </Text>
                    </Box>
                    <Box mr={4}>
                      <Text fontSize="3xl">by</Text>
                    </Box>
                    <Box mr={4}>
                      <Flex alignItems="center">
                        {post.author?.image && (
                          <Box
                            width={12}
                            height={12}
                            borderRadius={100}
                            overflow="hidden"
                            boxShadow="base"
                            mr={4}
                          >
                            <Image
                              src={post.author.image}
                              width="500"
                              height="500"
                              alt="Avatar"
                            />
                          </Box>
                        )}
                        <Text fontSize="3xl" whiteSpace="nowrap">
                          {post.author?.name}
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              </Box>
              <Syntax
                value={post.content || ""}
                codeLanguage={post.codeLanguage || CodeLanguage.JAVASCRIPT}
                slice={15}
              />
            </Box>
          </Flex>
        </Box>
        <Box mt={5}>
          <Flex alignItems="center" justifyContent="center">
            <Box mr={1.5}>
              <Text>Created with</Text>
            </Box>
            <Box style={{ marginBottom: -9 }}>
              <Logo />
            </Box>
          </Flex>
        </Box>
      </main>
    </ThumbnailLayout>
  );
};

export default ThumbnailPage;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  return {
    props: {
      cookies: req.headers.cookie ?? "",
    },
  };
};
