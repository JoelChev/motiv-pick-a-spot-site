import * as api from "../api/location.api";
import { to } from "../helpers";

export const get = async (params) => {
  const { data, error } = await to(api.get(params));

  if (error) throw error;

  console.log(data);

  return data;
};

export const getOne = async (id) => {
  const { data, error } = await to(api.getOne(id));

  if (error) throw error;

  console.log(data);

  return data;
};
