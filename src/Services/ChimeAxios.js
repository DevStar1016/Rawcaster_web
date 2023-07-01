import axios from "axios";
import { CHIME_BASE_URL } from "./ServiceConstants";

axios.defaults.baseURL = CHIME_BASE_URL;

const instance = axios.create({
  baseURL: CHIME_BASE_URL,
});

instance.interceptors.request.use(
  async (request) => {
    request.headers["Content-Type"] = "application/json";

    return request;
  },
  (error) => Promise.reject(error)
);

export default instance;
