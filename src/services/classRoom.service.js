import * as api from "../api/classRoom.api";
import { to } from "../helpers";

export const get = async (params) => {
  let { data, error } = await to(api.get(params));

  if (error) throw error;

  // We are going to filter out the entries without Television etnries as we don't need these class rooms.

  data = data.filter((classRoom) => {
    return classRoom.Televisions.length > 0;
  });

  console.log(data);

  return data;
};
