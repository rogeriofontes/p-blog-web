export interface Post {
    id?: string; // ID opcional (para novos posts)
    category_id: string; // Categoria do post
    title: string; // Título do post
    content: string; // Conteúdo do post
    tags?: string[]; // Tags opcionais
    created_at?: string; // Data de criação (pode ser gerada pelo backend)
}
