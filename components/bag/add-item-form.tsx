"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AddItemForm({ username }: { username: string }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, username }),
    });

    setLoading(false);
    setUrl("");
    router.refresh(); 
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Cole a URL do produto aqui"
        className="border px-2 py-1 rounded-md flex-grow"
        disabled={loading}
      />
      <button type="submit" disabled={loading} className="px-4 py-1 border rounded-md bg-blue-500 text-white disabled:bg-gray-400">
        {loading ? "Adicionando..." : "Adicionar"}
      </button>
    </form>
  );
}