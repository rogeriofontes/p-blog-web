import api from "./api";
import { PostComment } from "@/models/postComment";
import { useAuthStore } from "@/store/authStore";

// Buscar comentários de um post específico
export const getCommentsByPost = async (postId: string): Promise<PostComment[]> => {
  const response = await api.get(`/comments?post_id=${postId}`);
  return response.data;
};

// Criar um novo comentário
export const createComment = async (commentData: PostComment): Promise<PostComment> => {
  const { token } = useAuthStore.getState();
  const response = await api.post("/comments", commentData);
  return response.data;
};
