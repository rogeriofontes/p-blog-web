import { Post } from "@/models/post";
import api from "./api";
import { useAuthStore } from "@/store/authStore"; // Importando o authStore para obter o token

export const getPosts = async () => {
  const response = await api.get("/posts");
  return response.data;
};

export const getPostById = async (id: string) => {
  console.log("Buscando post com ID:", id); // Adiciona log

  const response = await api.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (postData: Post) => {
  const response = await api.post("/posts", postData);
  return response.data;
};

export const updatePost = async (id: string, postData: Post) => {
  const response = await api.put(`/posts/${id}`, postData);
  return response.data;
};

export const deletePost = async (id: string) => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};
