import { useState, useEffect } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface FetchResult<Data> {
  data: Data | null;
  loading: boolean;
  error: AxiosError<Data> | null;
}

export function useFetchApi<Data = any>(url: string): FetchResult<Data> {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError<Data> | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    axios.get<Data>(url, { signal })
      .then((response: AxiosResponse<Data>) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error: AxiosError<Data>) => {
        if (axios.isCancel(error)) {
          console.log('Fetch aborted');
        } else {
          setError(error);
          setLoading(false);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [url]);

  return { data, loading, error };
}
