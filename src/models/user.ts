export interface User {
    id?: string; // Opcional, pois o backend pode gerar automaticamente
    username: string;
    email: string;
    password: string;
    created_at?: string; // Opcional (gerado pelo backend)
}
