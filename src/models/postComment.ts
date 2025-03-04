export interface PostComment {
    id?: string; // ID opcional, gerado pelo backend
    post_id: string; // ID do post ao qual o comentário pertence
    user_id: string; // ID do usuário que fez o comentário
    content: string; // Texto do comentário
    created_at?: string; // Data de criação (opcional, gerada pelo backend)
}
