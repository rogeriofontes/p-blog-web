export interface PostTag {
    id?: string; // ID opcional, pode ser gerado pelo backend
    name: string; // Nome da tag
    created_at?: string; // Data de criação (opcional, geralmente gerada pelo backend)
}
