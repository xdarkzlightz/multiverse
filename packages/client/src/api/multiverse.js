import axios from "axios";

export default () => {
  const token = localStorage.getItem("token");

  return axios.create({
    baseURL: "/api/",
    timeout: 1000,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
