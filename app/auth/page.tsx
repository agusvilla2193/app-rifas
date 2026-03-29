import Link from 'next/link';

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-club-primary">
            <div className="rugby-card w-full max-w-md">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-2">BIENVENIDO</h2>
                    <p className="text-gray-400 text-sm tracking-widest uppercase">Panel de Vendedores</p>
                </div>

                <form className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 ml-1">Email del Club</label>
                        <input
                            type="email"
                            className="w-full bg-club-primary border border-white/10 rounded-lg px-4 py-3 focus:border-club-accent outline-none transition-all"
                            placeholder="vendedor@sanfernando.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 ml-1">Contraseña</label>
                        <input
                            type="password"
                            className="w-full bg-club-primary border border-white/10 rounded-lg px-4 py-3 focus:border-club-accent outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button className="w-full py-4 bg-club-accent text-club-primary font-extrabold rounded-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-club-accent/10">
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
