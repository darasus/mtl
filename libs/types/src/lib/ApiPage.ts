export type ApiPages<Item = unknown> = {
  pages: ApiPage<Item>;
  total: number;
  count: number;
  cursor: string | null;
};

export type ApiPage<Item = unknown> = {
  items: Item[];
  cursor: string | null;
  count: number;
  total: number;
};

export type NonCursorApiPages<Item = unknown> = {
  items: Item[];
  total: number;
  count: number;
};
