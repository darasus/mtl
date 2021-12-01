import { Button, Flex, Text, Box, Input } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useColors } from "../../hooks/useColors";
import { useCommentsQuery } from "../../hooks/query/useCommentsQuery";
import { DeleteCommentButton } from "./DeleteCommentButton";
import { useAddCommentMutation } from "../../hooks/mutation/useAddCommentMutation";
import { usePrevious } from "../../hooks/usePrevious";
import { useMe } from "../../hooks/useMe";

interface Props {
  postId: string;
}

export const Comments: React.FC<Props> = ({ postId }) => {
  const [take, setTake] = React.useState(5);
  const prevTake = usePrevious(take);
  const comments = useCommentsQuery({
    postId,
    take,
  });
  const me = useMe();
  const { borderColor, secondaryTextColor } = useColors();
  const { mutateAsync: commentPost } = useAddCommentMutation();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { comment: "" },
  });

  const submit = React.useMemo(
    () =>
      handleSubmit(async (data) => {
        reset();
        setTake(take + 1);
        await commentPost({ postId, content: data.comment, take });
      }),
    [handleSubmit, reset, commentPost, postId, take, setTake]
  );

  const hasComments =
    comments.data?.items?.length && comments.data?.items.length > 0;

  const handleLoadMore = React.useCallback(() => {
    setTake(take + 5);
  }, [take, setTake]);

  React.useEffect(() => {
    if (prevTake && prevTake !== take) {
      comments.refetch();
    }
  }, [prevTake, take, comments]);

  return (
    <>
      <Box p={3} borderColor={borderColor} borderTopWidth="thin">
        {!hasComments && (
          <Text color={secondaryTextColor} fontSize="sm">
            No comments yet...
          </Text>
        )}
        {comments.data?.count !== comments.data?.total && (
          <Flex justifyContent="center" mb={2}>
            <Button
              onClick={handleLoadMore}
              isLoading={comments.isFetching}
              loadingText={"Load more..."}
              variant="ghost"
              size="xs"
            >
              Load more...
            </Button>
          </Flex>
        )}
        {(comments.data?.items || []).map((comment) => {
          if (!comment.author) return null;
          if (!comment.author.image) return null;

          return (
            <Box key={comment.id}>
              <Flex mt={1} flexDirection="column">
                <Flex alignItems="center">
                  <Box
                    width={5}
                    height={5}
                    borderRadius={100}
                    overflow="hidden"
                    boxShadow="base"
                    mr={2}
                  >
                    <Image
                      src={comment.author.image}
                      width="100"
                      height="100"
                      alt="Avatar"
                    />
                  </Box>
                  <Box mr={2}>
                    <Text fontSize="sm" color={secondaryTextColor}>{`${
                      comment.author.name
                    } - ${new Date(comment.createdAt).toDateString()}`}</Text>
                  </Box>
                  {me?.user?.id === comment.author.id && (
                    <DeleteCommentButton
                      commentId={comment.id}
                      postId={postId}
                    />
                  )}
                </Flex>
                <Box ml={7}>
                  <Text fontSize="sm">{comment.content}</Text>
                </Box>
              </Flex>
            </Box>
          );
        })}
      </Box>
      {me && (
        <>
          <Box borderColor={borderColor} borderBottomWidth="thin" />
          <form onSubmit={submit}>
            <Box p={3}>
              <Flex>
                {me?.user?.picture && (
                  <Box
                    width={7}
                    height={7}
                    borderRadius={100}
                    overflow="hidden"
                    boxShadow="base"
                    mr={2}
                  >
                    <Image
                      src={me?.user.picture as string}
                      width="100"
                      height="100"
                      alt="Avatar"
                    />
                  </Box>
                )}
                <Box flexGrow={1}>
                  <Controller
                    name="comment"
                    control={control}
                    render={({ field }) => (
                      <Input
                        width="100%"
                        name={field.name}
                        onBlur={field.onBlur}
                        value={field.value}
                        aria-label="comment field"
                        onChange={(value) => field.onChange(value)}
                        placeholder="Type your comment here..."
                        required
                        autoComplete="off"
                      />
                    )}
                  />
                </Box>
              </Flex>
            </Box>
          </form>
        </>
      )}
    </>
  );
};
