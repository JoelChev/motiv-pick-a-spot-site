import * as api from "../api/pickASpot.api";
import { to } from "../helpers";

export const get = async (id) => {
  const { data, error } = await to(api.get(id));

  if (error) throw error;

  console.log(data);

  return data;
};
