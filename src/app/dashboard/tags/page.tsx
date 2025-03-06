"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getTags, createTag, updateTag, deleteTag } from "@/services/tagService";
import Link from "next/link";
import { PostTag } from "@/models/tag";

export default function TagsPage() {
  const router = useRouter();
  const { token, userId, logout } = useAuthStore();
  const [tags, setTags] = useState<PostTag[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [editingTag, setEditingTag] = useState<PostTag | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      fetchTags();
    }
  }, [token, router]);

  const fetchTags = async () => {
    try {
      const data: PostTag[] = await getTags();
      setTags(data || []);
    } catch (error) {
      console.error("Erro ao buscar tags", error);
      setTags([]);
    }
  };

  const handleCreateTag = async () => {
    if (!newTag.trim()) return;
    try {
      await createTag({ name: newTag });
      setNewTag("");
      fetchTags();
    } catch (error) {
      console.error("Erro ao criar tag", error);
    }
  };

  const handleUpdateTag = async () => {
    if (!editingTag || !editingTag.name.trim()) return;
    try {
      await updateTag(editingTag.id as string, { name: editingTag.name });
      setEditingTag(null);
      fetchTags();
    } catch (error) {
      console.error("Erro ao atualizar tag", error);
    }
  };

  const handleDeleteTag = async (id: string) => {
    try {
      await deleteTag(id);
      fetchTags();
    } catch (error) {
      console.error("Erro ao deletar tag", error);
    }
  };

  if (!isClient) return null;

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
        <h1 className="text-3xl font-bold mb-6">Gerenciar Tags</h1>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Nova Tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="border p-2 rounded"
          />
          <button onClick={handleCreateTag} className="bg-blue-500 text-white p-2 rounded">
            Adicionar
          </button>
        </div>
        <ul className="w-64">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <li key={tag.id} className="flex justify-between items-center border-b p-2">
                {editingTag?.id === tag.id ? (
                  <input
                    type="text"
                    value={editingTag?.name ?? ""}
                    onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                    className="border p-1 rounded"
                  />
                ) : (
                  <span>{tag.name}</span>
                )}
                <div className="flex gap-2">
                  {editingTag?.id === tag.id ? (
                    <button onClick={handleUpdateTag} className="bg-green-500 text-white p-1 rounded">
                      Salvar
                    </button>
                  ) : (
                    <button onClick={() => setEditingTag(tag)} className="bg-yellow-500 text-white p-1 rounded">
                      Editar
                    </button>
                  )}
                  <button onClick={() => handleDeleteTag(tag.id as string)} className="bg-red-500 text-white p-1 rounded">
                    Deletar
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="text-gray-500 text-center p-2">Nenhuma tag encontrada</li>
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
