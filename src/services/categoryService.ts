import api from "@/services/api";
import { Category } from "@/models/category";

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories");
  return response.data;
};

export const createCategory = async (category: Category): Promise<Category> => {
  const response = await api.post("/categories", category);
  return response.data;
};

export const updateCategory = async (id: string, category: Category): Promise<Category> => {
  const response = await api.put(`/categories/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};