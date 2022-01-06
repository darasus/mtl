import { Button, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useRecoilState } from 'recoil';
import { userTagFilterAtom } from '../atoms/userTagFilterAtom';
import { useUserTagsQuery } from '../hooks/query/useUserTagsQuery';

export const UserTagCloud = () => {
  const router = useRouter();
  const nickname = router.query.nickname as string;
  const userTags = useUserTagsQuery({ nickname });
  const [userTagFilter, setUserTagFilter] = useRecoilState(userTagFilterAtom);

  const handleTagClick = React.useCallback(
    (id) => () => {
      if (userTagFilter.includes(id)) {
        setUserTagFilter((prev) => prev.filter((tagId) => tagId !== id));
      } else {
        setUserTagFilter((prev) => [...prev, id]);
      }
    },
    [setUserTagFilter, userTagFilter]
  );

  if (!userTags.data) return null;
  if (userTags.data.length === 0) return null;

  return (
    <>
      <Flex flexWrap="wrap" mb={3}>
        {userTags.data?.map((tag) => (
          <Button
            mr={1}
            mb={1}
            key={tag.id}
            borderRadius="full"
            size="xs"
            variant={userTagFilter.includes(tag.id) ? 'cta' : 'solid'}
            onClick={handleTagClick(tag.id)}
          >
            {tag.name}
          </Button>
        ))}
      </Flex>
    </>
  );
};
