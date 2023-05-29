import * as api from "../api/classSession.api";
import { to } from "../helpers";

export const get = async (params) => {
  const { data, error } = await to(api.get(params));

  if (error) throw error;

  console.log(data);

  return data.data;
};
