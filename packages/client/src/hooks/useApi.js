import { useEffect, useState } from "react";
import axios from "axios";

export default initialDataState => {
  const [url, setUrl] = useState({ url: "", refetch: false });
  const [data, setData] = useState(initialDataState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    let cancel = false;
    const fetchData = async () => {
      if (!url.url) return;
      const token = localStorage.getItem("token");

      if (!token) {
        setAuth(false);
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const response = await axios({
          url: url.url,
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!cancel) {
          setData(response.data);
        }
      } catch (e) {
        if (!cancel) {
          console.error(e);
          setError(true);
        }
      }

      if (!cancel) {
        setLoading(false);
      }
    };

    fetchData();

    return () => (cancel = true);
  }, [url.url, url.refetch, url]);

  return [{ data, loading, error, auth, url }, { setUrl }];
};
