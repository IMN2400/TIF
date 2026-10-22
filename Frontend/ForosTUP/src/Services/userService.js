import {
  newUserToApi,
  userChangesToApi,
  userFromApi,
} from "../adapters/userAdapter.js";
import { httpRequest } from "./httpClient.js";

export const getUsers = async () => {
  const users = await httpRequest("/User");
  return users.map(userFromApi);
};

export const getUser = async (id) =>
  userFromApi(await httpRequest(`/User/${id}`));

export const createUser = (user) =>
  httpRequest("/User", {
    method: "POST",
    body: newUserToApi(user),
  });

export const updateUser = (id, changes) =>
  httpRequest("/User", {
    method: "PATCH",
    body: userChangesToApi(id, changes),
  });

export const deleteUser = (id) =>
  httpRequest(`/User/${id}`, { method: "DELETE" });
