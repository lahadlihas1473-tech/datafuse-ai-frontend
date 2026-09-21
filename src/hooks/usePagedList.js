import { useEffect, useState } from "react";
import { apiGet, buildQuery } from "../lib/api";

// Fetches one page of a searchable list endpoint. The previous page stays
// visible (dimmed) while the next one loads; stale requests are aborted.
export function usePagedList(path, { search, page, pageSize }) {
  const requestKey = `${path}${buildQuery({
    search,
    limit: pageSize,
    offset: (page - 1) * pageSize,
  })}`;

  const [result, setResult] = useState({ key: null, data: null, error: "" });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    apiGet(requestKey, { signal: controller.signal })
      .then((response) =>
        setResult({ key: requestKey, data: response.data, error: "" })
      )
      .catch((error) => {
        if (error.name !== "AbortError") {
          setResult({ key: requestKey, data: null, error: error.message });
        }
      });

    return () => controller.abort();
  }, [requestKey, retryCount]);

  const loading = result.key !== requestKey;

  return {
    data: result.data,
    error: loading ? "" : result.error,
    loading,
    retry: () => {
      setResult((current) => ({ ...current, key: null }));
      setRetryCount((count) => count + 1);
    },
  };
}
