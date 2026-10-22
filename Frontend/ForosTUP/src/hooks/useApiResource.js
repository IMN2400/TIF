import { useCallback, useEffect, useState } from "react";

export const useApiResource = (loader, param, initialValue) => {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = param === undefined ? await loader() : await loader(param);
      setData(result);
    } catch (loadError) {
      setError(loadError.message || "No se pudo recuperar la información.");
    } finally {
      setLoading(false);
    }
  }, [loader, param]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
};
