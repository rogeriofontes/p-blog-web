import api from "./api";

// Obtém a contagem de likes ou dislikes para um post específico
export const getReactions = async (postId: string, type: "likes" | "dislikes") => {
  try {
    const response = await api.get(`/reactions/${type}/post/${postId}`);
    console.log(response.data);
    return response.data; // Retorna apenas a contagem
  } catch (error) {
    console.error(`Erro ao obter ${type} do post ${postId}:`, error);
    return 0; // Retorna 0 em caso de erro
  }
};

// Envia uma reação (like/dislike) para um post
export const sendReaction = async (postId: string, userId: string, reaction: boolean) => {
  try {
    const response = await api.post("/reactions", {
      post_id: postId,
      user_id: userId,
      reaction: reaction, // true para like, false para dislike
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao enviar reação para o post ${postId}:`, error);
    throw error;
  }
};

export const removeReaction = async (postId: string) => {
  try {
    const response = await fetch(`/api/reactions/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Falha ao remover a reação");
    }

    console.log("Reação removida com sucesso");
  } catch (error) {
    console.error("Erro ao remover reação", error);
  }
};

export const getUserReaction = async (postId: string) => {
  try {
    const response = await fetch(`/api/reactions?post_id=${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Falha ao buscar a reação do usuário");
    }

    const data = await response.json();
    return data.reaction || null; // Retorna 'likes', 'dislikes' ou null se o usuário não reagiu
  } catch (error) {
    console.error("Erro ao buscar a reação do usuário", error);
    return null;
  }
};
