"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Credenciales incorrectas. Revisá el email y la clave.");
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-club-primary">
            <div className="rugby-card w-full max-w-md">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-2">BIENVENIDO</h2>
                    <p className="text-gray-400 text-sm tracking-widest uppercase">Panel de Vendedores</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 ml-1">Email del Vendedor</label>
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-club-primary border border-white/10 rounded-lg px-4 py-3 focus:border-club-accent outline-none transition-all"
                            placeholder="admin@club.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 ml-1">Contraseña</label>
                        <input
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-club-primary border border-white/10 rounded-lg px-4 py-3 focus:border-club-accent outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="w-full py-4 bg-club-accent text-club-primary font-extrabold rounded-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-club-accent/10">
                        ENTRAR AL PANEL
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
                        ← Volver al inicio
                    </Link>
                </div>
            </div>
        </main>
    );
}
