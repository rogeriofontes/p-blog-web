"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/services/categoryService";
import Link from "next/link";
import { Category } from "@/models/category";

export default function CategoriesPage() {
  const router = useRouter();
  const { token, user, logout } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
      setCategories([]);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await createCategory({ name: newCategory });
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      console.error("Erro ao criar categoria", error);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) return;
    try {
      await updateCategory(editingCategory.id as string, { name: editingCategory.name });
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Erro ao atualizar categoria", error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (error) {
      console.error("Erro ao deletar categoria", error);
    }
  };

  if (!isClient) return null;

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
        <h1 className="text-3xl font-bold mb-6">Gerenciar Categorias</h1>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Nova Categoria"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border p-2 rounded"
          />
          <button onClick={handleCreateCategory} className="bg-blue-500 text-white p-2 rounded">
            Adicionar
          </button>
        </div>
        <ul className="w-64">
          {categories.length > 0 ? (
            categories.map((category) => (
              <li key={category.id} className="flex justify-between items-center border-b p-2">
                {editingCategory?.id === category.id ? (
                  <input
                    type="text"
                    value={editingCategory?.name ?? ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="border p-1 rounded"
                  />
                ) : (
                  <span>{category.name}</span>
                )}
                <div className="flex gap-2">
                  {editingCategory?.id === category.id ? (
                    <button onClick={handleUpdateCategory} className="bg-green-500 text-white p-1 rounded">
                      Salvar
                    </button>
                  ) : (
                    <button onClick={() => setEditingCategory(category)} className="bg-yellow-500 text-white p-1 rounded">
                      Editar
                    </button>
                  )}
                  <button onClick={() => handleDeleteCategory(category.id as string)} className="bg-red-500 text-white p-1 rounded">
                    Deletar
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="text-gray-500 text-center p-2">Nenhuma categoria encontrada</li>
          )}
        </ul>
      </div>
      {/* Rodapé */}
      <footer className="mt-8 border-t border-gray-200 w-full text-center py-4 text-sm text-gray-500">
        <p>© 2025 Blog Minimal | <Link href="/sobre" className="text-gray-700 hover:underline">Sobre</Link></p>
      </footer>
    </div>
  );
}
