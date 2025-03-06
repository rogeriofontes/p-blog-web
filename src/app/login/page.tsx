"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { login } from "@/services/authService";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { token, userId, logout } = useAuthStore();
  const [error, setError] = useState("");
  const router = useRouter();
  const { setToken } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(email, password);
      setToken(data.token, data.userId);
      router.push("/dashboard"); // Redireciona após login
    } catch (err) {
      setError("Credenciais inválidas. Verifique seu email e senha.");
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
      <div className="w-full max-w-md mt-10 p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
        <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300  p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300  p-2 rounded"
            required
          />
          <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 transition disabled:opacity-50">
            Entrar
          </button>
        </form>
      </div>
      {/* Rodapé */}
      <footer className="mt-auto border-t border-gray-200 w-full text-center py-4 text-sm text-gray-500">
        <p>© 2025 Blog Minimal | <Link href="/sobre" className="text-gray-700 hover:underline">Sobre</Link></p>
      </footer>
    </div>
  );
}
