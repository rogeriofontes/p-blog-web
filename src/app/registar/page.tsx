"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/services/authService";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register(form);
      router.push("/login"); // Redireciona para login após sucesso
    } catch (err) {
      console.error("Erro no registro:", err);
      setError("Falha ao registrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white text-black font-sans">
      {/* Header */}
      <header className="w-full bg-black text-white py-4 px-6 flex justify-center shadow-md">
        <h1 className="text-2xl font-bold tracking-tight">Criar Conta</h1>
      </header>

      {/* Formulário */}
      <div className="w-full max-w-md mt-10 p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
        <h2 className="text-xl font-semibold text-center mb-4">Registrar-se</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Nome de usuário"
            value={form.username}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading ? "Criando conta..." : "Registrar"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Já tem uma conta?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Faça login
          </a>
        </p>
      </div>
    </div>
  );
}
