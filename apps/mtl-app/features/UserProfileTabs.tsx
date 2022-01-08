import { Box, Button, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useUserTagsQuery } from '../hooks/query/useUserTagsQuery';
import { Select } from '../components/Select';
import { useRecoilState } from 'recoil';
import { userPostsFilterAtom } from '../atoms/userPostsFilterAtom';
import { useMe } from '../hooks/useMe';

export const UserProfileTabs = () => {
  const router = useRouter();
  const userTags = useUserTagsQuery({
    nickname: router.query.nickname as string,
  });
  const me = useMe();
  const isMyPage = me?.user?.nickname === router.query.nickname;
  const [userPostsFilter, setUserPostsFilter] =
    useRecoilState(userPostsFilterAtom);

  const handleResetClick = React.useCallback(() => {
    setUserPostsFilter({ published: undefined, tags: undefined });
  }, [setUserPostsFilter]);

  const togglePublishedClick = React.useCallback(() => {
    setUserPostsFilter((currVal) => ({
      ...currVal,
      published: true,
    }));
  }, [setUserPostsFilter]);

  const handleDraftsClick = React.useCallback(() => {
    setUserPostsFilter((currVal) => ({
      ...currVal,
      published: false,
    }));
  }, [setUserPostsFilter]);

  const options = React.useMemo(
    () => [
      {
        options:
          userTags.data?.map((t) => ({
            value: t.id,
            label: t.name,
          })) || [],
      },
    ],
    [userTags.data]
  );

  const value = React.useMemo(() => {
    return options[0].options.filter((o) =>
      userPostsFilter.tags?.includes(o.value)
    );
  }, [options, userPostsFilter.tags]);

  return (
    <Flex mb={4} borderWidth="thin" p={2}>
      <Box mr={2}>
        <Select
          isMulti
          name="colors"
          options={options}
          placeholder="Select tags"
          closeMenuOnSelect={false}
          size="sm"
          onChange={(option) =>
            setUserPostsFilter((currVal) => {
              const tags = option.map((o) => o.value).sort();
              return {
                ...currVal,
                tags: tags.length === 0 ? undefined : tags,
              };
            })
          }
          value={value}
        />
      </Box>
      {isMyPage && (
        <>
          <Button
            onClick={togglePublishedClick}
            variant={userPostsFilter.published === true ? 'cta' : 'solid'}
            size="sm"
            mr={2}
          >
            Published
          </Button>
          <Button
            onClick={handleDraftsClick}
            variant={userPostsFilter.published === false ? 'cta' : 'solid'}
            size="sm"
            mr={2}
          >
            Drafts
          </Button>
        </>
      )}
      <Button
        onClick={handleResetClick}
        variant="link"
        size="sm"
        mr={2}
        disabled={
          typeof userPostsFilter.published === 'undefined' &&
          typeof userPostsFilter.tags === 'undefined'
        }
      >
        Reset
      </Button>
    </Flex>
  );
};
