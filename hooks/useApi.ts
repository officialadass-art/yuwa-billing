import { fetch } from 'expo/fetch';
import { useCallback, useRef, useState } from "react";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ApiClientOptions {
  baseUrl?: string;
  getToken?: (() => string | Promise<string | null> | null) | null;
  defaultHeaders?: Record<string, string>;
}

export function createApiClient(options: ApiClientOptions = {}) {
  const { baseUrl = "", getToken = null, defaultHeaders = { "Content-Type": "application/json" } } = options;

  const buildUrl = (path: string, params?: Record<string, string>) => {
    const url = path.startsWith("http") ? path : `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
    if (!params) return url;
    const q = new URLSearchParams(params as any).toString();
    return q ? `${url}?${q}` : url;
  };

  async function makeRequest(
    method: Method,
    path: string,
    body?: any,
    extraHeaders?: Record<string, string>,
    signal?: AbortSignal,
    params?: Record<string, string>
  ) {
    const url = buildUrl(path, params);
    const headers: Record<string, string> = { ...defaultHeaders, ...(extraHeaders ?? {}) };

    if (getToken) {
      try {
        const token = await getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;
      } catch (e) {
        // ignore token retrieval errors here; let request continue
      }
    }

    const init: RequestInit = { method, headers, signal };

    if (body != null) {
      if (body instanceof FormData) {
        // let fetch set the correct headers for FormData
        delete headers["Content-Type"];
        init.body = body as any;
      } else if ((headers["Content-Type"] ?? "").includes("application/json")) {
        init.body = JSON.stringify(body);
      } else {
        init.body = body;
      }
    }

    const res = await fetch(url, init);
    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await res.json() : await res.text();

    if (!res.ok) {
      const err: any = new Error("Request failed");
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  }

  // React hook to use inside components
  function useApi() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [data, setData] = useState<any>(null);
    const controllerRef = useRef<AbortController | null>(null);

    const request = useCallback(
      async ({
        method = "GET",
        path,
        body,
        headers,
        params,
      }: {
        method?: Method;
        path: string;
        body?: any;
        headers?: Record<string, string>;
        params?: Record<string, string>;
      }) => {
        // cancel previous
        if (controllerRef.current) controllerRef.current.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        setLoading(true);
        setError(null);

        try {
          const res = await makeRequest(method, path, body, headers, controller.signal, params);
          setData(res);
          return res;
        } catch (err: any) {
          if (err.name === "AbortError") {
            setError({ message: "aborted" });
            throw err;
          }
          setError(err);
          throw err;
        } finally {
          setLoading(false);
          controllerRef.current = null;
        }
      },
      []
    );

    const get = useCallback((path: string, params?: Record<string, string>, headers?: Record<string, string>) => request({ method: "GET", path, params, headers }), [request]);
    const post = useCallback((path: string, body?: any, headers?: Record<string, string>) => request({ method: "POST", path, body, headers }), [request]);
    const put = useCallback((path: string, body?: any, headers?: Record<string, string>) => request({ method: "PUT", path, body, headers }), [request]);
    const del = useCallback((path: string, body?: any, headers?: Record<string, string>) => request({ method: "DELETE", path, body, headers }), [request]);
    const cancel = useCallback(() => {
      controllerRef.current?.abort();
      controllerRef.current = null;
    }, []);

    return { data, error, loading, request, get, post, put, del, cancel } as const;
  }

  // convenience non-hook helpers
  return {
    useApi,
    request: makeRequest,
    get: (path: string, params?: Record<string, string>) => makeRequest("GET", path, undefined, undefined, undefined, params),
    post: (path: string, body?: any) => makeRequest("POST", path, body),
    put: (path: string, body?: any) => makeRequest("PUT", path, body),
    delete: (path: string, body?: any) => makeRequest("DELETE", path, body),
  };
}

export default createApiClient;

/*
Usage example:

const api = createApiClient({ baseUrl: 'https://api.example.com', getToken: () => myToken });
function MyComponent(){
  const { data, loading, error, get, post } = api.useApi();

  useEffect(()=>{ get('/items'); }, []);
}

Or using the plain helpers:
await api.post('/items', { name: 'x' });
*/
