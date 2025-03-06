"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { createPost } from "@/services/postService";
import { getCategories } from "@/services/categoryService";
import { Category } from "@/models/category";
import Link from "next/link";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function NewPostPage() {
    const router = useRouter();
    const { token, userId, logout } = useAuthStore();
    const [categories, setCategories] = useState<Category[]>([]);
    const [post, setPost] = useState({
        category_id: "",
        title: "",
        content: "",
        tags: [],
    });

    useEffect(() => {
        if (!token) {
            router.push("/login");
        } else {
            fetchCategories();
        }
    }, [token, router]);

    const fetchCategories = async () => {
        try {
            const data: Category[] = await getCategories();
            setCategories(data || []);
        } catch (error) {
            console.error("Erro ao buscar categorias", error);
        }
    };

    const handleCreatePost = async () => {
        if (!post.title.trim() || !post.content.trim() || !post.category_id.trim()) return;
        try {
            await createPost(post);
            router.push("/dashboard/posts");
        } catch (error) {
            console.error("Erro ao criar post", error);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-white text-black font-sans">
            {/* Header - Topo preto preenchendo toda a largura */}
            <header className="w-full bg-black text-white py-4 px-6 flex justify-between items-center shadow-md">
            <h1 className="text-2xl font-bold tracking-tight"><Link href="/dashboard" className="text-white-700 hover:underline">Blog Minimal</Link></h1>
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
                        <span className="text-sm">Logado como: <b>{userId}</b></span>
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
                <h1 className="text-3xl font-bold mb-6">Criar Novo Post</h1>
                <div className="flex flex-col gap-2 mb-4 w-full max-w-2xl">
                    <select
                        value={post.category_id}
                        onChange={(e) => setPost({ ...post, category_id: e.target.value })}
                        className="border p-2 rounded"
                    >
                        <option value="">Selecione uma categoria</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Título do Post"
                        value={post.title}
                        onChange={(e) => setPost({ ...post, title: e.target.value })}
                        className="border p-2 rounded"
                    />
                    <MDEditor value={post.content} onChange={(content) => setPost({ ...post, content: content || "" })} />
                    <button onClick={handleCreatePost} className="bg-blue-500 text-white p-2 rounded">
                        Salvar
                    </button>
                </div>
            </div>
            {/* Rodapé */}
            <footer className="mt-auto border-t border-gray-200 w-full text-center py-4 text-sm text-gray-500">
                <p>© 2025 Blog Minimal | <Link href="/sobre" className="text-gray-700 hover:underline">Sobre</Link></p>
            </footer>
        </div>
    );
}
