import { useCallback, useState } from "react";

export const usePagination = () => {
  const [page, setPage] = useState(1);

  const onNextPageClick = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  return { onNextPageClick, setPage, page };
};
