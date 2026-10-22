import {
  getPost,
  updatePostBody,
} from "../../Services/postService.js";

const unavailable = (feature) => {
  throw new Error(`${feature} todavía no está disponible en la API .NET.`);
};

export const fetchPost = getPost;

export const updatePost = (postId, { body }) =>
  updatePostBody(postId, body);

export const fetchMyLike = () => unavailable("La consulta de likes");

export const likePost = () => unavailable("La gestión de likes");

export const deletePost = () => unavailable("La eliminación de publicaciones");

export const makeUserAdmin = () => unavailable("El cambio de rol");
