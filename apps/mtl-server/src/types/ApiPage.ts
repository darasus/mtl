export type ApiPages<Item = unknown> = {
  pages: Item[];
  total: number;
  count: number;
  cursor: string | null;
};

export type NonCursorApiPages<Item = unknown> = {
  items: Item[];
  total: number;
  count: number;
};
