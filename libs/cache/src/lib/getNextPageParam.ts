export const getNextPageParam = (lastPage, pages) => {
  const localTotal = pages
    .map((page) => page.count)
    .reduce((prev, next) => prev + next, 0);

  if (localTotal === lastPage.total) return undefined;

  return lastPage.cursor;
};
