import { atom } from 'recoil';
import { AtomKey } from './AtomKey';

export const userTagFilterAtom = atom({
  key: AtomKey.UserTagFilter,
  default: [],
});
