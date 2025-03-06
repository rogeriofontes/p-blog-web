"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getPosts, deletePost } from "@/services/postService";
import { getCategories } from "@/services/categoryService";
import { Post } from "@/models/post";
import { Category } from "@/models/category";
import Link from "next/link";

export default function PostsPage() {
  const router = useRouter();
  const { token, userId, logout } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      fetchPosts();
      fetchCategories();
    }
  }, [token, router]);

  const fetchPosts = async () => {
    try {
      const data: Post[] = await getPosts();
      setPosts(data || []);
    } catch (error) {
      console.error("Erro ao buscar posts", error);
      setPosts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const data: Category[] = await getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Erro ao buscar categorias", error);
      setCategories([]);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deletePost(id);
      fetchPosts();
    } catch (error) {
      console.error("Erro ao deletar post", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white text-black font-sans">
      {/* Header - Topo preto preenchendo toda a largura */}
      <header className="w-full bg-black text-white py-4 px-4 flex justify-between items-center shadow-md">
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
      <div className="flex flex-col items-center min-h-screen p-4">
        <h1 className="text-3xl font-bold mb-6">Todos os Posts</h1>
        <Link href="/dashboard/posts/new" className="bg-blue-500 text-white p-2 rounded mb-4">
          Criar Novo Post
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="border p-4 rounded shadow-md">
                <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                <p className="text-gray-700 line-clamp-3">{post.content.substring(0, 100)}...</p>
                <small className="text-gray-500">
                  Categoria: {categories.find((c) => c.id === post.category_id)?.name || "Desconhecida"}
                </small>
                <div className="flex gap-2 mt-2">
                  <Link href={`/dashboard/posts/edit/${post.id}`} className="bg-yellow-500 text-white p-1 rounded">
                    Editar
                  </Link>
                  <button onClick={() => post.id && handleDeletePost(post.id)} className="bg-red-500 text-white p-1 rounded">
                    Deletar
                  </button>
                  <Link href={`/dashboard/posts/detail/${post.id}`} className="bg-blue-500 text-white p-1 rounded">
                    Visualizar
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center p-2">Nenhum post encontrado</p>
          )}
        </div>
      </div>
      {/* Rodapé */}
      <footer className="mt-auto border-t border-gray-200 w-full text-center py-4 text-sm text-gray-500">
        <p>© 2025 Blog Minimal | <Link href="/sobre" className="text-gray-700 hover:underline">Sobre</Link></p>
      </footer>
    </div>
  );
}
