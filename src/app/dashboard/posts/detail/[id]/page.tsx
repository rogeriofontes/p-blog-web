"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getPostById } from "@/services/postService";
import { getCategories } from "@/services/categoryService";
import { Post } from "@/models/post";
import { Category } from "@/models/category";
import Link from "next/link";
import MarkdownPreview from "@uiw/react-markdown-preview";

export default function PostDetailPage() {
    const router = useRouter();
    const { id } = useParams();
    const { token, user, logout } = useAuthStore();
    const [post, setPost] = useState<Post | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log("ID recebido da URL:", id);

        if (!id) {
            console.error("ID não encontrado na URL!");
            return;
        }

        fetchPost(id as string);
        fetchCategories();
    }, [id]);

    const fetchPost = async (postId: string) => {
        try {
            console.log(`Buscando post com ID: ${postId}`);
            const data = await getPostById(id as string);
            console.log("Post encontrado:", data);
            console.log(data);
            setPost(data);
        } catch (error) {
            console.error("Erro ao buscar post", error);
            router.push("/dashboard/posts");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data || []);
        } catch (error) {
            console.error("Erro ao buscar categorias", error);
        }
    };

    if (isLoading) {
        return <p className="text-center p-4">Carregando...</p>;
    }

    if (!post) {
        return <p className="text-center p-4">Post não encontrado.</p>;
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-white text-black font-sans">
            {/* Header - Topo preto preenchendo toda a largura */}
            <header className="w-full bg-black text-white py-4 px-6 flex justify-between items-center shadow-md">
                <h1 className="text-2xl font-bold tracking-tight">Blog Minimal</h1>

                {/* Menu de navegação */}
                {token ? (
                    <nav className="flex gap-6">
                        <Link href="/dashboard/posts" className="hover:underline">
                            Posts
                        </Link>
                        <Link href="/dashboard/categories" className="hover:underline">
                            Categorias
                        </Link>
                        <Link href="/dashboard/tags" className="hover:underline">
                            Tags
                        </Link>
                        <Link href="/dashboard/comments" className="hover:underline">
                            Comentários
                        </Link>
                    </nav>
                ) : null}

                {/* Se não estiver logado, exibe botão de Login */}
                {!token ? (
                    <div className="flex gap-4">
                        <Link
                            href="/registar"
                            className="border border-white px-4 py-2 rounded hover:bg-gray-800 transition"
                        >
                            Registrar
                        </Link>
                        <button
                            onClick={() => router.push("/login")}
                            className="border border-white px-4 py-2 rounded hover:bg-gray-800 transition"
                        >
                            Login
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <span className="text-sm">Logado como: <b>{user?.username}</b></span>
                        <button
                            onClick={logout}
                            className="border border-white px-4 py-2 rounded hover:bg-red-700 transition"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </header>

            <div className="flex flex-col items-center min-h-screen p-8">
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                <small className="text-gray-500">
                    Categoria: {categories.find((c) => c.id === post.category_id)?.name || "Desconhecida"}
                </small>

                {/* Renderização do conteúdo com suporte a Markdown */}
                <div className="border p-4 mt-4 w-full max-w-2xl">
                    <MarkdownPreview source={post.content} className="p-4 border rounded bg-white shadow-md" />
                </div>

                {/* Exibição de Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2 mt-4">
                        {post.tags.map((tag, index) => (
                            <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Botão para voltar */}
                {!token ? (
                    <Link href="/dashboard" className="bg-blue-500 text-white p-2 rounded mt-6">
                        Voltar para Posts
                    </Link>
                ) : (
                    <Link href="/dashboard/posts" className="bg-blue-500 text-white p-2 rounded mt-6">
                        Voltar para Posts
                    </Link>
                )}
            </div>
            {/* Rodapé */}
            <footer className="mt-8 border-t border-gray-200 w-full text-center py-4 text-sm text-gray-500">
                <p>© 2025 Blog Minimal | <Link href="/sobre" className="text-gray-700 hover:underline">Sobre</Link></p>
            </footer>
        </div>
    );
}
