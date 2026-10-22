import { newPostToApi, postFromApi } from "../adapters/postAdapter.js";
import { httpRequest } from "./httpClient.js";

export const getPostsByForum = async (forumId) => {
  const posts = await httpRequest(`/Post?forumId=${encodeURIComponent(forumId)}`);
  return posts.map(postFromApi);
};

export const getPost = async (id) =>
  postFromApi(await httpRequest(`/Post/${id}`));

export const createPost = async (post) =>
  postFromApi(
    await httpRequest("/Post", {
      method: "POST",
      body: newPostToApi(post),
    })
  );

export const updatePostBody = (id, body) =>
  httpRequest(`/Post/${id}`, {
    method: "PATCH",
    body: body.trim(),
  });
