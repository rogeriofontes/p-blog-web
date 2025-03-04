import api from "./api";
import { PostTag } from "@/models/tag";

// Função para buscar todas as tags
export const getTags = async (): Promise<PostTag[]> => {
  const response = await api.get("/tags");
  return response.data;
};

// Função para buscar uma tag por ID
export const getTagById = async (id: string): Promise<PostTag> => {
  const response = await api.get(`/tags/${id}`);
  return response.data;
};

// Criar uma nova tag
export const createTag = async (tagData: PostTag): Promise<PostTag> => {
  const response = await api.post("/tags", tagData);
  return response.data;
};

// Atualizar uma tag por ID
export const updateTag = async (id: string, tagData: PostTag): Promise<PostTag> => {
  const response = await api.put(`/tags/${id}`, tagData);
  return response.data;
};

// Deletar uma tag por ID
export const deleteTag = async (id: string): Promise<void> => {
  await api.delete(`/tags/${id}`);
};
