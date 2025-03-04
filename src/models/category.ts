export interface Category {
    id?: string; // Opcional, pois pode ser gerado pelo backend
    name: string; // Nome da categoria
    created_at?: string; // Opcional, pode ser gerado pelo backend
}
