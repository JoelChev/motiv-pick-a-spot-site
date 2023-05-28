import axios, * as others from "axios";
import { to } from "../helpers";
const url = process.env.REACT_APP_BASE_API_URL;

export const get = async (params) => {
  const { data, error } = await to(
    axios.get(`${url}/marianatek/classSessions`, {
      params,
    })
  );

  if (error) {
    throw error;
  }

  return data.data;
};
