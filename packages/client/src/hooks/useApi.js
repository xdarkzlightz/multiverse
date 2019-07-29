import { useEffect, useState } from "react";
import axios from "axios";

export default initialDataState => {
  const [url, setUrl] = useState();
  const [data, setData] = useState(initialDataState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!url) return;
      const token = localStorage.getItem("token");
      setLoading(true);

      if (!token) {
        setAuth(false);
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const response = await axios({
          url,
          headers: { Authorization: `Bearer ${token}` }
        });

        setData(response.data);
      } catch (e) {
        console.error(e);
        setError(true);
      }

      setLoading(false);
    };

    fetchData();
  }, [url]);

  return [{ data, loading, error, auth }, setUrl];
};
