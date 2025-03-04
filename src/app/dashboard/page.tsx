"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { getPosts } from "@/services/postService";
import { getCommentsByPost, createComment } from "@/services/commentService";
import { getReactions, removeReaction, sendReaction, getUserReaction } from "@/services/reactionService";
import { Post } from "@/models/post";
import { PostComment } from "@/models/postComment";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { token, userId, logout } = useAuthStore();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<{ [key: string]: PostComment[] }>({});
  const [reactions, setReactions] = useState<{ [key: string]: { likes: number; dislikes: number; userReaction: boolean | null } }>({});
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data || []);
      data.forEach((post: Post) => {
        fetchComments(post.id as string)
        fetchReactions(post.id as string);
      });
    } catch (error) {
      console.error("Erro ao buscar posts", error);
      setPosts([]);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const data = await getCommentsByPost(postId);
      setComments((prev) => ({ ...prev, [postId]: data || [] }));
    } catch (error) {
      console.error("Erro ao buscar comentários", error);
    }
  };

  const fetchReactions = async (postId: string) => {
    try {

      const userReaction = await getUserReaction(postId); // Nova função para pegar a reação do usuário
      const likesResponse = await getReactions(postId, "likes");
      const dislikesResponse = await getReactions(postId, "dislikes");
      // Acesse os valores diretamente das propriedades retornadas
      const likes = likesResponse?.likes || 0;
      const dislikes = dislikesResponse?.dislikes || 0;

      console.log('Likes:', likes);
      console.log('Dislikes:', dislikes);
      console.log("User Reaction:", userReaction); // Log para depuração

      setReactions((prev) => ({
        ...prev,
        [postId]: { likes, dislikes, userReaction },
      }));
    } catch (error) {
      console.error("Erro ao buscar reações", error);
    }
  };
  const toggleReaction = async (postId: string, type: "likes" | "dislikes") => {
    try {
      const currentReaction = reactions[postId]?.userReaction;

      if (currentReaction === (type === "likes")) {
        // If the current reaction is the same as the new reaction, remove the reaction
        await removeReaction(postId);
        setReactions((prev) => ({
          ...prev,
          [postId]: {
            likes: type === "likes" ? prev[postId].likes - 1 : prev[postId].likes,
            dislikes: type === "dislikes" ? prev[postId].dislikes - 1 : prev[postId].dislikes,
            userReaction: null,
          },
        }));
      } else {
        // If the reaction is different, update it
        await sendReaction(postId, userId as string, type === "likes");
        setReactions((prev) => ({
          ...prev,
          [postId]: {
            likes: type === "likes" ? prev[postId].likes + 1 : prev[postId].likes,
            dislikes: type === "dislikes" ? prev[postId].dislikes + 1 : prev[postId].dislikes,
            userReaction: type === "likes",
          },
        }));
      }
    } catch (error) {
      console.error("Erro ao reagir ao post", error);
    }
  };

  const handleCreateComment = async (postId: string) => {
    if (!newComments[postId]?.trim()) return;
    try {
      const commentData: PostComment = {
        post_id: postId,
        user_id: userId || "Anônimo",
        content: newComments[postId],
      };
      await createComment(commentData);
      setNewComments((prev) => ({ ...prev, [postId]: "" }));
      fetchComments(postId);
    } catch (error) {
      console.error("Erro ao criar comentário", error);
    }
  };

  const handleReaction = async (postId: string, reaction: boolean) => {
    if (!token || !userId) {
      alert("Você precisa estar logado para reagir!");
      return;
    }

    try {
      await sendReaction(postId, userId as string, reaction);
      fetchReactions(postId);
    } catch (error) {
      console.error("Erro ao registrar reação", error);
    }
  };

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
            <span className="text-sm">Logado como: <br /><b>{userId}</b></span>
            <button
              onClick={logout}
              className="border border-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Grid de Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-6 p-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="border border-gray-200 p-6 rounded-lg shadow-sm bg-white">
              <h3 className="font-semibold text-xl mb-2">{post.title}</h3>
              <p className="text-gray-700 text-sm line-clamp-3">{post.content}</p>
              <Link href={`/dashboard/posts/detail/${post.id}`} className="text-blue-500 hover:underline mt-2 block">
                Ver mais →
              </Link>

              {/* Botões de Like e Dislike */}
              <div className="flex gap-2 mt-4 items-center">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                  onClick={() => handleReaction(post.id as string, true)}
                  disabled={!token}
                >
                  👍 {post.id ? reactions[post.id]?.likes || 0 : 0}
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  onClick={() => handleReaction(post.id as string, false)}
                  disabled={!token}
                >
                  👎 {post.id ? reactions[post.id]?.dislikes || 0 : 0}
                </button>
              </div>

              {/* Comentários */}
              <div className="mt-4">
                <h4 className="font-semibold text-sm text-gray-600">Comentários</h4>
                <ul className="space-y-2 mt-2">
                  {post.id && comments[post.id]?.length > 0 ? (
                    comments[post.id].map((comment) => (
                      <li key={comment.id} className="border border-gray-300 p-2 rounded bg-gray-50">
                        <p className="text-sm">{comment.content}</p>
                        <small className="text-gray-500">{comment.user_id}</small>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">Nenhum comentário ainda.</p>
                  )}
                </ul>

                {/* Formulário de Novo Comentário (Somente se logado) */}
                {token && (
                  <div className="mt-2">
                    <textarea
                      value={post.id ? newComments[post.id] || "" : ""}
                      onChange={(e) => setNewComments((prev) => ({ ...prev, [post.id as string]: e.target.value }))}
                      placeholder="Escreva um comentário..."
                      className="border border-gray-300 bg-white p-2 rounded w-full"
                    />
                    <button
                      onClick={() => handleCreateComment(post.id as string)}
                      className="bg-black text-white px-4 py-2 rounded mt-2 hover:bg-gray-900 transition"
                    >
                      Comentar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center p-2">Nenhum post encontrado</p>
        )}
      </div>

      {/* Rodapé */}
      <footer className="mt-8 border-t border-gray-200 w-full text-center py-4 text-sm text-gray-500">
        <p>© 2025 Blog Minimal | <Link href="/sobre" className="text-gray-700 hover:underline">Sobre</Link></p>
      </footer>
    </div>
  );
}
