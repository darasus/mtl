export type ApiPages<Item = unknown> = {
  pages: ApiPage<Item>;
  total: number;
  count: number;
  currPage: number;
  nextPage: number | null;
};

export type ApiPage<Item = unknown> = {
  items: Item[];
  count: number;
  total: number;
  currPage: number;
  nextPage: number | null;
};
