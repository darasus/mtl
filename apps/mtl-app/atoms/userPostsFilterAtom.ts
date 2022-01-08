import { atom } from 'recoil';
import { AtomKey } from './AtomKey';

export const userPostsFilterAtom = atom<{
  tags: string[] | undefined;
  published: boolean | undefined;
}>({
  key: AtomKey.UserTagFilter,
  default: {
    tags: undefined,
    published: undefined,
  },
});
